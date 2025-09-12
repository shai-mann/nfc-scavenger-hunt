import Logo from "@/assets/images/DDlogo.png";
import { CluePath } from "@/components/CluePath";
import { Text } from "@/components/ui/text";
import { BookOpen } from "lucide-react-native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  // TODO: fetch rank from api
  const rank = 1;

  return (
    <SafeAreaView className="flex-1 bg-white flex flex-col">
      <View className="px-5 py-2 flex flex-col items-center justify-center border-secondary border-b">
        {/* Logo, floating left */}
        <Image source={Logo} className="absolute left-5 top-2 size-10" />

        <Text variant="h1" className="text-gray-800 font-semibold">
          Bits&apos; Hunt!
        </Text>
        <Text variant="default" className="text-gray-500 font-semibold">
          Rank: {rank}
        </Text>

        {/* Rules button, floating right */}
        <TouchableOpacity className="absolute right-5 top-2 p-2">
          <BookOpen size={20} color="#AD8AD1" />
        </TouchableOpacity>
      </View>
      <CluePath />
    </SafeAreaView>
  );
}
