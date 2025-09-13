import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import React from "react";
import { Linking, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RULES_DATA = [
  <>
    The first person to scan all clues and find the Creator of the Hunt will be
    crowned the victor, and{" "}
    <Text variant="default" className="font-semibold">
      given a prize!
    </Text>
  </>,
  <>
    All clues are NFC tags. When you find a clue,{" "}
    <Text variant="default" className="font-semibold">
      scan the card
    </Text>{" "}
    to unlock it.
  </>,
  <>
    Cards should{" "}
    <Text variant="default" className="font-semibold">
      not be removed
    </Text>{" "}
    from their spots. Scan it and leave it!
  </>,
  <>
    All clues are hidden{" "}
    <Text variant="default" className="font-semibold">
      within the Boston office
    </Text>
    . They are never outside of the building, nor are they in the basement,
    lobby, or Foundation room.
  </>,
  <>
    Cards will{" "}
    <Text variant="default" className="font-semibold">
      not necessarily be in easily visible locations
    </Text>
    , but will always be accessible without moving large furniture or other big
    items.
  </>,
  <>
    Hints for certain clues{" "}
    <Text variant="default" className="font-semibold">
      may become available
    </Text>{" "}
    once the first person completes the hunt.
  </>,
  "These clues will test your knowledge of Datadog, Computer Science, and other random facts!",
];

export default function RulesModal() {
  const handleClose = () => {
    router.back();
  };

  const handleBugReport = () => {
    Linking.openURL(process.env.EXPO_PUBLIC_BUG_REPORT_FORM || "");
  };

  const bugReportRule = (
    <>
      Most of all, I hope you enjoy this scavenger hunt! If you find any bugs,
      please report them{" "}
      <Text
        variant="default"
        className="font-semibold"
        onPress={handleBugReport}
      >
        here
      </Text>{" "}
      or on the Settings page.
    </>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex flex-row justify-between items-center px-5 py-2 border-b border-border">
        <Text variant="h1" className="text-2xl font-semibold">
          How to play
        </Text>
        <TouchableOpacity onPress={handleClose} className="p-2">
          <IconSymbol size={24} name="xmark" color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-col">
          <Text
            variant="h2"
            className="font-semibold mb-2 self-center mx-auto !border-b-0"
          >
            Welcome to Bits&apos; Hunt!
          </Text>
          <View className="flex flex-col gap-y-4 border-b border-border pb-8">
            <Text variant="default" className="text-base font-light leading-6">
              This is a scavenger hunt that I, an anonymous Datadog, have
              created. Find all 13 clues and find me, to win a prize!
            </Text>
          </View>
          {RULES_DATA.concat(bugReportRule).map((rule, index) => (
            <View
              key={index}
              className={cn(
                "flex flex-row items-start border-b border-border py-4"
              )}
            >
              <View className="w-8 h-8 bg-primary/10 rounded-full mr-4 mt-1 items-center justify-center">
                <Text
                  variant="default"
                  className="text-primary font-semibold text-sm"
                >
                  {index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text variant="default" className="text-base leading-6">
                  {rule}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Text
          variant="default"
          className="text-base leading-6 font-light text-muted-foreground mt-4 mb-8"
        >
          <Text className="underline text-muted-foreground">Disclaimer</Text>:
          This hunt is not officially affiliated with Datadog - I&apos;m just a
          Datadog with some spare time!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
