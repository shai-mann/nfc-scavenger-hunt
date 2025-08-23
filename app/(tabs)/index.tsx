import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomePage() {
  const [isClueModalVisible, setIsClueModalVisible] = useState(false);

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

        <TouchableOpacity
          style={styles.clueButton}
          onPress={() => setIsClueModalVisible(true)}
        >
          <IconSymbol size={24} name="magnifyingglass" color="#007AFF" />
          <ThemedText type="defaultSemiBold" style={styles.clueButtonText}>
            Clue Finding
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Clue Finding Modal */}
      <Modal
        visible={isClueModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsClueModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              Clue Finding
            </ThemedText>
            <TouchableOpacity
              onPress={() => setIsClueModalVisible(false)}
              style={styles.closeButton}
            >
              <IconSymbol size={24} name="xmark" color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <ThemedText type="default" style={styles.modalText}>
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
          </ScrollView>
        </ThemedView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 24,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
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
});
