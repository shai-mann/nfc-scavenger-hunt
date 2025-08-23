import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomePage() {
  const handleClueFinding = () => {
    router.push("/clue-finding");
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          Home Page
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText type="default" style={styles.welcomeText}>
          Welcome to your NFC Scavenger Hunt adventure!
        </ThemedText>

        <TouchableOpacity style={styles.clueButton} onPress={handleClueFinding}>
          <IconSymbol size={24} name="magnifyingglass" color="#007AFF" />
          <ThemedText type="defaultSemiBold" style={styles.clueButtonText}>
            Clue Finding
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.8,
  },
  clueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  clueButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
});
