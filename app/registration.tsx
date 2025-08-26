import Logo from "@/assets/images/DDlogo.png";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [errorText, setErrorText] = useState("");
  const inputRef = useRef<any>(null);

  const handleRegistration = () => {
    // TODO: confirm uniqueness of username
    if (username.trim().length === 0) {
      setErrorText("Please enter a username");
      return;
    }

    // Here you would typically save the username to storage/state
    // For now, just navigate to the home page
    router.replace("/(tabs)");
  };

  useEffect(() => {
    if (errorText) {
      setTimeout(() => {
        setErrorText("");
      }, 3000);
    }
  }, [errorText]);

  // button animation
  // Shared values for animation
  const scale = useSharedValue(1);

  // Animated style that updates on UI thread
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-secondary/50">
      <TouchableWithoutFeedback onPress={() => inputRef.current?.blur()}>
        <View className="flex-1 px-5 pt-[30%] flex flex-col items-center gap-6">
          {/* Logo in top third */}
          <Image source={Logo} className="size-40 rounded-xl" />

          {/* Title and input centered */}
          <View className="flex flex-col gap-10 items-center w-full">
            <Text variant="h1" className="text-gray-800 font-semibold">
              Join Bits&apos; Hunt!
            </Text>

            <Input
              ref={inputRef}
              className={cn(
                "border-2 border-gray-300 rounded-md p-3 w-full h-12",
                errorText && "border-destructive border-2"
              )}
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Button at bottom */}
          <Pressable
            className="mt-auto w-full"
            onPress={handleRegistration}
            onPressIn={() => (scale.value = withSpring(0.95))}
            onPressOut={() => (scale.value = withSpring(1))}
            disabled={username.trim().length === 0}
          >
            <Animated.View
              className={cn(
                "bg-primary rounded-md p-3 w-full items-center justify-center",
                username.trim().length === 0 && "opacity-50"
              )}
              style={animatedStyle}
            >
              <Text className="text-white font-semibold">Start the Hunt!</Text>
            </Animated.View>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
