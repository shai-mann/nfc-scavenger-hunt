import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const handleClueFinding = () => {
    router.push("/clue-finding");
  };

  return (
    <SafeAreaView className="flex-1 bg-white flex flex-col">
      <View className="px-5 pb-5">
        <Text variant="h1">NFC Hunt</Text>
      </View>

      <View className="flex-1 justify-center items-center px-5">
        <ThemedText
          type="default"
          className="text-lg text-center mb-10 opacity-80"
        >
          Welcome to your NFC Scavenger Hunt adventure!
        </ThemedText>

        <TouchableOpacity
          className="flex-row items-center bg-gray-100 px-6 py-4 rounded-xl gap-3"
          onPress={handleClueFinding}
        >
          <IconSymbol size={24} name="magnifyingglass" color="#007AFF" />
          <ThemedText type="defaultSemiBold" className="text-lg text-blue-500">
            Clue Finding
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
