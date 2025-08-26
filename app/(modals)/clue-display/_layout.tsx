import { Stack } from "expo-router";

export default function ClueDisplayLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="[clueId]" />
    </Stack>
  );
}
