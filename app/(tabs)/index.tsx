import { CluePath } from "@/components/CluePath";
import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Clue {
  id: number;
  name: string;
  description: string;
}

const CLUES: Clue[] = [
  {
    id: 1,
    name: "Clue 1",
    description: "This is the first clue",
  },
  {
    id: 2,
    name: "Clue 2",
    description: "This is the second clue",
  },

  {
    id: 3,
    name: "Clue 3",
    description: "This is the third clue",
  },
  {
    id: 4,
    name: "Clue 4",
    description: "This is the fourth clue",
  },
  {
    id: 5,
    name: "Clue 5",
    description: "This is the fifth clue",
  },
  {
    id: 6,
    name: "Clue 6",
    description: "This is the sixth clue",
  },
  {
    id: 7,
    name: "Clue 7",
    description: "This is the seventh clue",
  },
  {
    id: 8,
    name: "Clue 8",
    description: "This is the eighth clue",
  },
  {
    id: 9,
    name: "Clue 9",
    description: "This is the ninth clue",
  },
  {
    id: 10,
    name: "Clue 10",
    description: "This is the tenth clue",
  },
  {
    id: 11,
    name: "Clue 11",
    description: "This is the eleventh clue",
  },
  {
    id: 12,
    name: "Clue 12",
    description: "This is the twelfth clue",
  },
  {
    id: 13,
    name: "Clue 13",
    description: "This is the thirteenth clue",
  },
];

export default function HomePage() {
  return (
    <SafeAreaView className="flex-1 bg-white flex flex-col">
      <View className="px-5 pb-5 flex flex-col items-center justify-center">
        <Text variant="h1">NFC Hunt</Text>
        <Text variant="h4" className="text-gray-500">
          Rank: 1
        </Text>
      </View>
      <CluePath clues={CLUES} />
    </SafeAreaView>
  );
}
