import Logo from "@/assets/images/DDlogo.png";
import { CluePath } from "@/components/CluePath";
import { Text } from "@/components/ui/text";
import { apiClient, Clue } from "@/server/lib/api";
import { BookOpen } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ClueForDisplay {
  id: string;
  name: string;
  description: string;
  isFound: boolean;
}

export default function HomePage() {
  const [clues, setClues] = useState<ClueForDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadUserClues();
  }, []);

  const loadUserClues = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUserClues();
      
      if (response.success && response.data) {
        const cluesForDisplay: ClueForDisplay[] = response.data.map((clue: any) => ({
          id: clue.id,
          name: clue.title,
          description: clue.title, // Using title as description for now
          isFound: !!clue.unlocked_at,
        }));
        setClues(cluesForDisplay);
      } else {
        setError(response.error || "Failed to load clues");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error loading clues:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white flex flex-col items-center justify-center">
        <ActivityIndicator size="large" color="#AD8AD1" />
        <Text className="mt-4 text-gray-500">Loading your progress...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white flex flex-col items-center justify-center">
        <Text className="text-red-500 text-center px-4">{error}</Text>
        <TouchableOpacity 
          onPress={loadUserClues}
          className="mt-4 bg-primary px-4 py-2 rounded"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white flex flex-col">
      <View className="px-5 py-2 flex flex-col items-center justify-center border-secondary border-b">
        {/* Logo, floating left */}
        <Image source={Logo} className="absolute left-5 top-2 size-10" />

        <Text variant="h1" className="text-gray-800 font-semibold">
          Bits&apos; Hunt!
        </Text>
        <Text variant="default" className="text-gray-500 font-semibold">
          Clues Found: {clues.filter(c => c.isFound).length}
        </Text>

        {/* Rules button, floating right */}
        <TouchableOpacity className="absolute right-5 top-2 p-2">
          <BookOpen size={20} color="#AD8AD1" />
        </TouchableOpacity>
      </View>
      <CluePath clues={clues} />
    </SafeAreaView>
  );
}
