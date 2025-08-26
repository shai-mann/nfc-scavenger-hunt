import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router, useLocalSearchParams } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Temporary clue data structure - in a real app, this would come from an API or database
const TEMP_CLUES = {
  "clue-1": {
    id: "clue-1",
    title: "The Hidden Library",
    text: "Find the ancient tome hidden behind the third pillar from the entrance. The answer lies within its weathered pages.",
    isCopyable: true,
    image: null,
  },
  "clue-2": {
    id: "clue-2",
    title: "Secret Garden Path",
    text: "Follow the stone path that winds through the rose garden. Count the steps and remember the number.",
    isCopyable: false,
    image: null,
  },
  "clue-3": {
    id: "clue-3",
    title: "The Clock Tower Mystery",
    text: "At exactly 3:15 PM, the shadow of the clock tower points to a hidden marker. What do you see?",
    isCopyable: true,
    image: "https://example.com/clock-tower.jpg", // Placeholder image URL
  },
  "clue-4": {
    id: "clue-4",
    title: "Digital Footprints",
    text: "Scan the QR code on the student center wall. The digital trail will lead you to your next destination.",
    isCopyable: true,
    image: null,
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
  };

  const handleCopyText = async () => {
    if (clue.isCopyable && clue.text) {
      try {
        // In a real app, you'd use a clipboard library like @react-native-clipboard/clipboard
        // For now, we'll just show an alert
        Alert.alert(
          "Text Copied!",
          "The clue text has been copied to your clipboard."
        );
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {clue.title}
        </ThemedText>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <IconSymbol size={24} name="xmark" color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Clue ID Display */}
        <View style={styles.clueIdContainer}>
          <ThemedText type="default" style={styles.clueId}>
            Clue ID: {clue.id}
          </ThemedText>
        </View>

        {/* Clue Text */}
        {clue.text && (
          <View style={styles.textContainer}>
            <View style={styles.textHeader}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Clue Text
              </ThemedText>
              {clue.isCopyable && (
                <TouchableOpacity
                  onPress={handleCopyText}
                  style={[styles.copyButton, copied && styles.copyButtonCopied]}
                >
                  <IconSymbol
                    size={16}
                    name={copied ? "checkmark" : "doc.on.doc"}
                    color={copied ? "#34C759" : "#007AFF"}
                  />
                  <ThemedText
                    type="default"
                    style={[
                      styles.copyButtonText,
                      copied && styles.copyButtonTextCopied,
                    ]}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            <View
              style={[
                styles.textBlock,
                clue.isCopyable && styles.copyableTextBlock,
              ]}
            >
              <ThemedText type="default" style={styles.clueText}>
                {clue.text}
              </ThemedText>
              {clue.isCopyable && (
                <View style={styles.copyableIndicator}>
                  <IconSymbol size={12} name="doc.on.doc" color="#007AFF" />
                  <ThemedText type="default" style={styles.copyableText}>
                    Copyable
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Clue Image */}
        {clue.image && (
          <View style={styles.imageContainer}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Clue Image
            </ThemedText>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: clue.image }}
                style={styles.clueImage}
                resizeMode="cover"
                // Fallback for when image fails to load
                onError={() => {
                  console.log("Image failed to load");
                }}
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol size={20} name="flag" color="#007AFF" />
            <ThemedText type="default" style={styles.actionButtonText}>
              Mark as Found
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol size={20} name="star" color="#FF9500" />
            <ThemedText type="default" style={styles.actionButtonText}>
              Add to Favorites
            </ThemedText>
          </TouchableOpacity>
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
    flex: 1,
    marginRight: 20,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  clueIdContainer: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  clueId: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  textContainer: {
    marginBottom: 24,
  },
  textHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  copyButtonCopied: {
    backgroundColor: "#f0fff0",
  },
  copyButtonText: {
    fontSize: 14,
    color: "#007AFF",
  },
  copyButtonTextCopied: {
    color: "#34C759",
  },
  textBlock: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#e0e0e0",
  },
  copyableTextBlock: {
    borderLeftColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  clueText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  copyableIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  copyableText: {
    fontSize: 12,
    color: "#007AFF",
  },
  imageContainer: {
    marginBottom: 24,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  clueImage: {
    width: "100%",
    height: 200,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#333",
  },
});
