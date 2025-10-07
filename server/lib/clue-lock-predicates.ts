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

  // Since count is 1-indexed, if count = 2 and order_index = 2, then we have 2 previous clues unlocked, and are unlocking clue 3.
  // Therefore, the clue is locked if the count is not equal to the order_index.
  return numPreviousUnlockedClues !== clue.order_index;
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
