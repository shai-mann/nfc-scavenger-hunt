import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Clipboard from "@react-native-clipboard/clipboard";
import { router, useLocalSearchParams } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
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

// Temporary clue data structure - in a real app, this would come from an API or database
const TEMP_CLUES = {
  "1": {
    id: "1",
    title: "The Hidden Library",
    text: "Find the ancient tome hidden behind the third pillar from the entrance. The answer lies within its weathered pages.",
    isCopyable: true,
    image: null,
    bits_description: "Hard-Working Bits",
  },
  "2": {
    id: "2",
    title: "Secret Garden Path",
    text: "Follow the stone path that winds through the rose garden. Count the steps and remember the number.",
    isCopyable: false,
    image: null,
    bits_description: "Gay Pride Bits",
  },
  "3": {
    id: "3",
    title: "The Clock Tower Mystery",
    text: "At exactly 3:15 PM, the shadow of the clock tower points to a hidden marker. What do you see?",
    isCopyable: true,
    image: "https://example.com/clock-tower.jpg", // Placeholder image URL
    bits_description: "Bee-Loving Bits",
  },
  "4": {
    id: "4",
    title: "Digital Footprints",
    text: "Scan the QR code on the student center wall. The digital trail will lead you to your next destination.",
    isCopyable: true,
    image: null,
    bits_description: "Weirdo Bits",
  },
};

const IS_CLUE_UNLOCKED = true;
const IS_USER_REGISTERED = true;

export default function ClueDisplayModal() {
  useLayoutEffect(() => {
    // TODO: add a check to see if the user is registered
    if (!IS_USER_REGISTERED) {
      // if unregistered, redirect to registration
      router.replace("/registration");
    } else if (!IS_CLUE_UNLOCKED) {
      // if registered but the clue is not unlocked yet, redirect to home
      // the clue would be unlocked in the clue-finding modal, so it cannot be displayed here
      // if it is not unlocked.
      // TODO: make this checked against the server
      router.replace("/(tabs)");
    }
  }, []);

  const { clueId } = useLocalSearchParams<{ clueId: string }>();
  const [copied, setCopied] = useState(false);

  // Get the clue data - fallback to a default if not found
  const clue = TEMP_CLUES[clueId as keyof typeof TEMP_CLUES] || {
    id: clueId,
    title: "Clue Not Found",
    text: "This clue could not be found. Please check the clue ID and try again.",
    isCopyable: false,
    image: null,
    bits_description: "Watercolor Bits",
  };

  const handleCopyText = async () => {
    if (clue.isCopyable && clue.text) {
      try {
        Clipboard.setString(clue.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
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
            You found {clue.bits_description}!
          </Text>
        </View>

        {/* Clue Text */}
        <View className="flex flex-col gap-y-3 mb-6">
          <Text variant="h4" className="font-semibold">
            To find the next Bits...
          </Text>

          {clue.text && (
            <Pressable
              className="p-4 rounded-xl bg-muted"
              onPress={handleCopyText}
            >
              <Text variant="default" className="text-base leading-6 mb-2">
                {clue.text}
              </Text>
              {clue.isCopyable && (
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
              )}
            </Pressable>
          )}

          {clue.image && (
            <View className="rounded-xl overflow-hidden bg-muted">
              <Image
                source={{ uri: clue.image }}
                className="w-full h-50"
                resizeMode="cover"
                // Fallback for when image fails to load
                onError={() => {
                  console.log("Image failed to load");
                }}
              />
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
