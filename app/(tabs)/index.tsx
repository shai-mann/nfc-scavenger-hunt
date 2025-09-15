import Logo from "@/assets/images/DDlogo.png";
import { CluePath } from "@/components/CluePath";
import { Text } from "@/components/ui/text";
import { apiClient } from "@/lib/api-client";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { BookOpen } from "lucide-react-native";
import React, { useCallback } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const {
    data: rankData,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["rank", apiClient.getUserId()],
    queryFn: async () => {
      const response = await apiClient.getUserRank();
      return response.data;
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <SafeAreaView className="flex-1 bg-white flex flex-col">
      <View className="px-5 py-2 flex flex-col items-center justify-center border-secondary border-b">
        {/* Logo, floating left */}
        <Image source={Logo} className="absolute left-5 top-2 size-10" />

        <Text variant="h1" className="text-gray-800 font-semibold">
          Bits&apos; Hunt!
        </Text>
        <Text variant="default" className="text-gray-500 font-semibold">
          Rank:{" "}
          {rankData?.rank ?? (isPending ? "Loading..." : "Failed to load rank")}
        </Text>

        {/* Rules button, floating right */}
        <TouchableOpacity
          className="absolute right-5 top-2 p-2"
          onPress={() => router.push("/(modals)/rules")}
        >
          <BookOpen size={20} color="#AD8AD1" />
        </TouchableOpacity>
      </View>
      <CluePath />
    </SafeAreaView>
  );
}
