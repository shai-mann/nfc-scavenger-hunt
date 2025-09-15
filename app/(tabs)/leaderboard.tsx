import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { Text } from "@/components/ui/text";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Crown, Medal, Trophy, User } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function LeaderboardPage() {
  const insets = useSafeAreaInsets();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const {
    data: leaderboardData,
    isPending,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await apiClient.getLeaderboard();
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Separate handler for manual pull-to-refresh
  const handleManualRefresh = useCallback(async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  }, [refetch]);

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LoadingState message="Loading leaderboard..." />
      </SafeAreaView>
    );
  }

  if (error || !leaderboardData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ErrorState
          error={{
            message: "We couldn't load the leaderboard data. Please try again.",
          }}
          refetch={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 py-2 flex flex-col items-center justify-center border-secondary border-b">
        <Text variant="h1" className="text-gray-800 font-semibold">
          Bits&apos; Leaderboard
        </Text>
        <Text variant="default" className="text-gray-500 font-semibold">
          Top hunters in the scavenger hunt
        </Text>
      </View>

      {/* Leaderboard List */}
      {leaderboardData.length > 0 ? (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => `${item.username}-${item.rank}`}
          renderItem={({ item }) => <LeaderboardItem item={item} />}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: insets.bottom + 25,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isManualRefreshing}
              onRefresh={handleManualRefresh}
              colors={["#AD8AD1"]}
              tintColor="#AD8AD1"
            />
          }
        />
      ) : (
        <FlatList
          data={[]}
          renderItem={() => null}
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#AD8AD1"]}
              tintColor="#AD8AD1"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-8">
              <User size={48} color="#9ca3af" />
              <Text variant="large" className="mt-4 text-center text-gray-600">
                No players yet
              </Text>
              <Text variant="muted" className="mt-2 text-center">
                Be the first to solve some clues and make it to the leaderboard!
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const LeaderboardItem = ({
  item,
}: {
  item: {
    username: string;
    consecutiveClues: number;
    totalClues: number;
    rank: number;
  };
}) => {
  const colors = getRankColors(item.rank);
  const isTopThree = item.rank <= 3;

  return (
    <View
      className={`mx-4 mb-3 rounded-2xl border p-4 shadow-sm ${colors.bg} ${
        isTopThree ? "shadow-md" : ""
      }`}
    >
      <View className="flex-row items-center">
        {/* Rank Icon */}
        <View className="mr-4 items-center justify-center">
          {getRankIcon(item.rank)}
          {item.rank > 3 && (
            <Text variant="small" className={`mt-1 font-bold ${colors.accent}`}>
              #{item.rank}
            </Text>
          )}
        </View>

        {/* User Info */}
        <View className="flex-1 gap-y-1">
          <Text variant="large" className={`font-semibold ${colors.text}`}>
            {item.username}
          </Text>
          <Text variant="small" className={colors.accent}>
            {item.totalClues} total clue{item.totalClues !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Score Badge */}
        <View
          className={cn(
            "rounded-xl px-3 py-2 border border-secondary",
            isTopThree ? "bg-white/70" : "bg-gray-50"
          )}
        >
          <Text
            variant="large"
            className={`text-center font-bold ${colors.text}`}
          >
            {item.consecutiveClues}
          </Text>
          <Text
            variant="small"
            className={`text-center uppercase ${colors.accent}`}
          >
            streak
          </Text>
        </View>
      </View>
    </View>
  );
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown size={24} color="#FFD700" />;
    case 2:
      return <Trophy size={24} color="#C0C0C0" />;
    case 3:
      return <Medal size={24} color="#CD7F32" />;
    default:
      return <User size={20} color="#64748b" />;
  }
};

const getRankColors = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        bg: "bg-yellow-50 border-yellow-200",
        text: "text-yellow-800",
        accent: "text-yellow-600",
      };
    case 2:
      return {
        bg: "bg-gray-50 border-gray-200",
        text: "text-gray-800",
        accent: "text-gray-600",
      };
    case 3:
      return {
        bg: "bg-orange-50 border-orange-200",
        text: "text-orange-800",
        accent: "text-orange-600",
      };
    default:
      return {
        bg: "bg-white border-gray-100",
        text: "text-gray-900",
        accent: "text-gray-600",
      };
  }
};
