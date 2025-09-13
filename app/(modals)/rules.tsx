import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Temporary rules data - easily editable
const RULES_DATA = [
  "Each QR code (Bits) contains a clue to find the next location.",
  "Scan QR codes using your device's camera when you find them.",
  "Follow the clues in order - each one leads to the next.",
  "Some locations may require solving puzzles or riddles.",
  "Ask for help if you're stuck, but try to solve it yourself first!",
  "Be respectful of all locations and other participants.",
  "The first person to complete all clues wins the hunt!",
  "Have fun and enjoy exploring!"
];

export default function RulesModal() {
  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex flex-row justify-between items-center px-5 py-2 border-b border-border">
        <Text variant="h1" className="text-2xl font-semibold">
          Rules
        </Text>
        <TouchableOpacity onPress={handleClose} className="p-2">
          <IconSymbol size={24} name="xmark" color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-4">
          {RULES_DATA.map((rule, index) => (
            <View key={index} className="flex-row items-start">
              <View className="w-8 h-8 bg-primary/10 rounded-full mr-4 mt-1 items-center justify-center">
                <Text variant="default" className="text-primary font-semibold text-sm">
                  {index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text variant="default" className="text-base leading-6">
                  {rule}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}