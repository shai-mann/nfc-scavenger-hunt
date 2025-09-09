import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, setupUniversalQueryBehavior } from "@/config/api";
import "../global.css";
import { useEffect } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Set up universal query behavior
  useEffect(() => {
    const cleanup = setupUniversalQueryBehavior();
    return cleanup;
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="registration">
          <Stack.Screen name="registration" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)"
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
