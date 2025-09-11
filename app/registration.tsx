import Logo from "@/assets/images/DDlogo.png";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function RegistrationPage() {
  const [username, setUsername] = useState("");
  const inputRef = useRef<any>(null);

  const { isPending, error, reset, mutate } = useMutation({
    mutationFn: async (userData: { username: string }) => {
      const response = await apiClient.registerUser(userData);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || "An error occurred");
      }
    },
    onSuccess: () => {
      // Registration successful, navigate to home
      router.replace("/(tabs)");
    },
    retry: false,
  });

  const handleRegistration = () => {
    if (username.trim().length === 0) {
      return; // Let the disabled state handle this
    }
    mutate({ username: username.trim() });
  };

  useEffect(() => {
    // Reset error state when username changes
    reset();
  }, [reset, username]);

  const logoTopMargin = useSharedValue(30);

  // logo animation (margin top for when keyboard is visible)
  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      marginTop: `${logoTopMargin.value}%`,
    };
  });

  // keyboard animation
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => {
        logoTopMargin.value = withTiming(20, { duration: 150 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        logoTopMargin.value = withTiming(30, { duration: 150 });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [logoTopMargin]);

  // button animation
  // Shared values for animation
  const scale = useSharedValue(1);

  // Animated style that updates on UI thread
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-secondary/50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={() => inputRef.current?.blur()}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            className="flex-1 px-5"
          >
            <View className="flex-1 flex flex-col items-center gap-6">
              {/* Logo in top third */}
              <Animated.Image
                source={Logo}
                className="size-40 rounded-xl"
                style={animatedLogoStyle}
              />

              {/* Title and input centered */}
              <View className="flex flex-col gap-10 items-center w-full">
                <Text variant="h1" className="text-gray-800 font-semibold">
                  Join Bits&apos; Hunt!
                </Text>

                <View className="w-full flex flex-col items-center relative">
                  {error && (
                    <Text className="text-destructive text-sm px-1 text-center self-start absolute top-[-20px] left-0">
                      {error instanceof Error
                        ? error.message
                        : "Registration failed"}
                    </Text>
                  )}
                  <Input
                    ref={inputRef}
                    className={cn(
                      "border-2 border-gray-300 rounded-md p-3 w-full h-12",
                      error && "border-destructive border-2"
                    )}
                    placeholder="Enter username"
                    value={username}
                    onChangeText={setUsername}
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>
            {/* Spacer to push button down when keyboard is hidden */}
            <View className="flex-1" />

            {/* Button - will stay above keyboard */}
            <View className="w-full pb-5">
              <Pressable
                onPress={handleRegistration}
                onPressIn={() => (scale.value = withSpring(0.95))}
                onPressOut={() => (scale.value = withSpring(1))}
                disabled={username.trim().length === 0 || isPending || !!error}
              >
                <Animated.View
                  className={cn(
                    "bg-primary rounded-md p-3 w-full flex flex-row items-center justify-center",
                    (username.trim().length === 0 || isPending || !!error) &&
                      "opacity-50"
                  )}
                  style={animatedButtonStyle}
                >
                  {isPending && (
                    <View className="mr-2">
                      <ActivityIndicator size="small" color="white" />
                    </View>
                  )}
                  <Text className="text-white font-semibold">
                    {isPending ? "Creating Account..." : "Start the Hunt!"}
                  </Text>
                </Animated.View>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
