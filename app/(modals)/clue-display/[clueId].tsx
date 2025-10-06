import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Clue } from "@/types/api";
import Clipboard from "@react-native-clipboard/clipboard";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClueDisplayModal() {
  const { clueId, password } = useLocalSearchParams<{
    clueId: string;
    password: string;
  }>();
  const [copied, setCopied] = useState(false);
  const [clue, setClue] = useState<Clue | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] =
    useState<string>("Loading clue...");
  const [error, setError] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string>("");

  const handleUnlockClue = useCallback(async () => {
    setLoading(true);
    setLoadingMessage("Unlocking clue...");
    if (!clueId || !password) {
      setError("Missing required parameters");
    } else {
      const response = await apiClient.unlockClue(clueId, password);
      if (response.data && response.success) {
        setClue(response.data);
      } else {
        console.error("Error unlocking clue:", response.error, response);
        setError("Clue could not be unlocked");
      }
    }

    setLoading(false);
  }, [clueId, password]);

  const loadClueData = useCallback(async () => {
    if (!clueId) {
      setError("No clue ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Loading clue...");
      const response = await apiClient.getClue(clueId);

      if (response.success && response.data) {
        setClue(response.data);
      } else if (response.error && response.status === 403) {
        // A forbidden response means the clue is not unlocked, so we will attempt to unlock it
        handleUnlockClue();
      } else {
        console.error("Error loading clue:", response.error);
        setError("Failed to load clue");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error loading clue:", err);
    } finally {
      setLoading(false);
    }
  }, [clueId, handleUnlockClue]);

  useLayoutEffect(() => {
    // Check if user is registered by seeing if apiClient has a userId
    if (!apiClient.getUserId()) {
      router.replace("/registration");
      return;
    }

    // Load the clue data
    loadClueData();
  }, [loadClueData]);

  const handleCopyText = async () => {
    if (clue?.data.text) {
      try {
        Clipboard.setString(clue?.data.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("Error copying text to clipboard:", error);
        Alert.alert("Error", "Failed to copy text to clipboard.");
      }
    }
  };

  const handleClose = () => {
    router.back();
  };

  const scale = useSharedValue(1);

  // Animated style that updates on UI thread
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background h-screen">
        <LoadingState message={loadingMessage} />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !clue) {
    return (
      <SafeAreaView className="flex-1 bg-background h-screen">
        <ErrorState error={{ message: error }} refetch={loadClueData} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background h-screen">
      <View className="flex flex-row justify-between items-center pl-5 pr-3 py-2 border-b border-border">
        <Text variant="h3" className="text-2xl">
          {clue.title}
        </Text>
        <TouchableOpacity onPress={handleClose} className="p-2">
          <IconSymbol size={24} name="xmark" color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 pt-5 px-5"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
      >
        {/* Clue ID Display */}
        <View className="bg-muted p-3 rounded-lg mb-6">
          <Text variant="default" className="text-sm opacity-70 text-center">
            You found {clue.bits_name}!
          </Text>
        </View>

        {/* Clue Text */}
        <View className="flex flex-col gap-y-3 mb-6">
          <Text variant="h4" className="font-semibold">
            To find the next Bits...
          </Text>

          {clue.data.text && (
            <Pressable
              className="p-4 rounded-xl bg-muted"
              onPress={handleCopyText}
            >
              <Text variant="default" className="text-base leading-6 mb-2">
                {clue.data.text}
              </Text>
              <View className="flex-row items-center gap-1 self-end">
                <IconSymbol
                  size={12}
                  name={copied ? "checkmark" : "doc.on.doc"}
                  color={copied ? "#34C759" : "#007AFF"}
                />
                <Text
                  variant="default"
                  className={cn("text-xs", {
                    "text-green-600": copied,
                    "text-blue-600": !copied,
                  })}
                >
                  {copied ? "Copied!" : "Copyable"}
                </Text>
              </View>
            </Pressable>
          )}
          {clue.data.image && (
            <View className="relative justify-center items-center">
              <Image
                source={{ uri: clue.data.image }}
                className="w-full h-full p-8 border border-muted rounded-lg"
                resizeMode="contain"
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError("Image failed to load");
                }}
              />
              {imageLoading && (
                <ActivityIndicator
                  className="absolute"
                  size="large"
                  color="#AD8AD1"
                />
              )}
              {imageError && (
                <Text className="text-destructive">{imageError}</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      {/* Action to close modal */}
      <View className="px-5 border-t border-border mt-auto pb-3">
        <Pressable
          onPress={handleClose}
          onPressIn={() => (scale.value = withSpring(0.95))}
          onPressOut={() => (scale.value = withSpring(1))}
          className="mt-3"
        >
          <Animated.View
            className="bg-primary rounded-md p-3 w-full items-center justify-center"
            style={animatedButtonStyle}
          >
            <Text className="text-white font-semibold">
              Find the next Bits!
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
