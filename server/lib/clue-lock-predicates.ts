import { supabase } from "./supabase";
import { Clue, LockState } from "./types";

// Check if a given clue ID is locked if the lock_state is requires_previous
const isRequiresPreviousLocked = async (clue: Clue, userId: string) => {
  if (clue.order_index === 0) {
    return false; // first clue can't be locked in this state, since it would be impossible to unlock it.
  }

  // See if any of the previous clues are not unlocked (in which case the clue is locked)
  const { data } = await supabase
    .from("user_progress")
    .select("*, clues ( order_index )")
    .eq("user_id", userId)
    .lt("clues.order_index", clue.order_index);

  const numPreviousUnlockedClues = data?.length || 0;

  return numPreviousUnlockedClues !== clue.order_index - 1;
};

const CLUE_LOCK_PREDICATES: Record<
  LockState,
  (clue: Clue, userId: string) => Promise<boolean>
> = {
  none: () => Promise.resolve(false),
  requires_previous: isRequiresPreviousLocked,
};

export const isLocked = (clue: Clue, userId: string) =>
  CLUE_LOCK_PREDICATES[clue.lock_state](clue, userId);
