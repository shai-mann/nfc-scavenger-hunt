import { CluePath } from "@/components/CluePath";
import { Text } from "@/components/ui/text";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface Clue {
  id: number;
  name: string;
  description: string;
  isFound: boolean;
}

const CLUES: Clue[] = [
  {
    id: 1,
    name: "Clue 1",
    description: "This is the first clue",
    isFound: true,
  },
  {
    id: 2,
    name: "Clue 2",
    description: "This is the second clue",
    isFound: true,
  },

  {
    id: 3,
    name: "Clue 3",
    description: "This is the third clue",
    isFound: true,
  },
  {
    id: 4,
    name: "Clue 4",
    description: "This is the fourth clue",
    isFound: false,
  },
  {
    id: 5,
    name: "Clue 5",
    description: "This is the fifth clue",
    isFound: false,
  },
  {
    id: 6,
    name: "Clue 6",
    description: "This is the sixth clue",
    isFound: false,
  },
  {
    id: 7,
    name: "Clue 7",
    description: "This is the seventh clue",
    isFound: false,
  },
  {
    id: 8,
    name: "Clue 8",
    description: "This is the eighth clue",
    isFound: false,
  },
  {
    id: 9,
    name: "Clue 9",
    description: "This is the ninth clue",
    isFound: false,
  },
  {
    id: 10,
    name: "Clue 10",
    description: "This is the tenth clue",
    isFound: false,
  },
  {
    id: 11,
    name: "Clue 11",
    description: "This is the eleventh clue",
    isFound: false,
  },
  {
    id: 12,
    name: "Clue 12",
    description: "This is the twelfth clue",
    isFound: false,
  },
  {
    id: 13,
    name: "Clue 13",
    description: "This is the thirteenth clue",
    isFound: false,
  },
];

export default function HomePage() {
  return (
    <SafeAreaView className="flex-1 bg-white flex flex-col">
      <View className="px-5 py-2 flex flex-col items-center justify-center border-secondary border-b">
        <Text variant="h1" className="text-gray-800 font-semibold">
          Bits&apos; Hunt
        </Text>
        <Text variant="h4" className="text-gray-500">
          Rank: 1
        </Text>
      </View>
      <CluePath clues={CLUES} />
    </SafeAreaView>
  );
}
