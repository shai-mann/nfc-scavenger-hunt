import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function ClueFindingModal() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          Clue Finding
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <IconSymbol size={24} name="xmark" color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText type="default" style={styles.introText}>
          This is where you&apos;ll find clues and hints for your scavenger
          hunt!
        </ThemedText>

        <View style={styles.clueSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Recent Clues
          </ThemedText>
          <ThemedText type="default" style={styles.clueText}>
            No clues found yet. Start exploring to discover your first clue!
          </ThemedText>
        </View>

        <View style={styles.clueSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            How to Find Clues
          </ThemedText>
          <ThemedText type="default" style={styles.clueText}>
            1. Look for NFC tags around the area{"\n"}
            2. Tap your device on the tags{"\n"}
            3. Collect clues and solve puzzles{"\n"}
            4. Earn points and climb the leaderboard!
          </ThemedText>
        </View>

        <View style={styles.clueSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Available Areas
          </ThemedText>
          <View style={styles.areaList}>
            <View style={styles.areaItem}>
              <IconSymbol size={20} name="mappin.circle.fill" color="#007AFF" />
              <ThemedText type="default" style={styles.areaText}>
                Main Campus
              </ThemedText>
            </View>
            <View style={styles.areaItem}>
              <IconSymbol size={20} name="mappin.circle.fill" color="#34C759" />
              <ThemedText type="default" style={styles.areaText}>
                Library Gardens
              </ThemedText>
            </View>
            <View style={styles.areaItem}>
              <IconSymbol size={20} name="mappin.circle.fill" color="#FF9500" />
              <ThemedText type="default" style={styles.areaText}>
                Student Center
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introText: {
    fontSize: 16,
    marginBottom: 30,
    lineHeight: 24,
  },
  clueSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  clueText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  areaList: {
    gap: 12,
  },
  areaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  areaText: {
    fontSize: 16,
  },
});
