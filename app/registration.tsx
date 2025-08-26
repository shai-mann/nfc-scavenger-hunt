import Logo from "@/assets/images/DDlogo.png";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function RegistrationPage() {
  const [username, setUsername] = useState("");
  const [errorText, setErrorText] = useState("");
  const inputRef = useRef<any>(null);

  const handleRegistration = () => {
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

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.blur()}>
      <View className="flex-1 px-5">
        {/* Centered content */}
        <View className="flex-1 justify-center items-center">
          <Image
            source={Logo}
            className="size-20 float-start translate-y-[-100px]"
          />
          <Text variant="h1" className="text-gray-800 font-semibold mb-10">
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
        <TouchableOpacity
          className="bg-primary rounded-md p-3 w-full items-center justify-center mb-8"
          onPress={handleRegistration}
        >
          <Text className="text-white font-semibold">Start the Hunt!</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
