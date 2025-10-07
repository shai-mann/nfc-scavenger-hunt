import { apiClient } from "@/lib/api-client";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    // Wait for userId to be loaded from storage before redirecting
    apiClient.getUserIdAsync().then((userId) => {
      router.replace(userId ? "/(tabs)" : "/registration");
    });
  }, []);

  return null;
}
