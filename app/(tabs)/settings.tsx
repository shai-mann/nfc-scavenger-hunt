import { Button } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function SettingsPage() {
  const insets = useSafeAreaInsets();

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(
    null
  );

  // Check if user is registered and redirect if not
  useLayoutEffect(() => {
    if (!apiClient.getUserId()) {
      router.replace("/registration");
      return;
    }
  }, []);

  // Fetch user profile
  const {
    data: userProfile,
    refetch: refetchProfile,
    isPending: isPendingProfile,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await apiClient.getUserProfile();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || "Failed to load user profile");
    },
  });

  useEffect(() => {
    if (userProfile) {
      setCurrentUser({ username: userProfile.username });
      setNewUsername(userProfile.username);
    }
  }, [userProfile]);

  // Username update mutation (stubbed for now)
  const { mutate: updateUsername, isPending: isUpdatingUsername } = useMutation(
    {
      mutationFn: async (username: string) => {
        const response = await apiClient.updateUserProfile({ username });
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.error || "Failed to update username");
      },
      onSuccess: (updatedUser) => {
        setCurrentUser(updatedUser);
        setIsEditingUsername(false);
        Alert.alert("Success", "Username updated successfully!");
        refetchProfile();
      },
      onError: (error) => {
        console.error("Failed to update username:", error);
        Alert.alert("Error", error.message);
      },
    }
  );

  const handleUsernameUpdate = () => {
    if (newUsername.trim().length === 0) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }
    if (newUsername.trim() === currentUser?.username) {
      setIsEditingUsername(false);
      return;
    }
    updateUsername(newUsername.trim());
  };

  const handleProfilePictureUpload = () => {
    Alert.alert("Profile Picture", "Profile picture upload coming soon!", [
      { text: "OK" },
    ]);
    // TODO: Implement actual profile picture upload when API endpoint exists
    console.log("Profile picture upload requested");
  };

  const handleBugReport = () => {
    Alert.alert(
      "Bug Report",
      "Bug reporting feature coming soon! For now, please contact support directly.",
      [{ text: "OK" }]
    );
    // TODO: Implement actual bug reporting when API endpoint exists
    console.log("Bug report requested");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex flex-row justify-between items-center px-5 py-2 border-b border-border">
        <Text variant="h1" className="text-2xl font-semibold">
          Settings
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-6 mb-20"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Section */}
        <View className="mb-8">
          <Text
            variant="h3"
            className="text-lg font-semibold mb-4 text-muted-foreground"
          >
            PROFILE
          </Text>

          {/* Profile Picture */}
          <TouchableOpacity
            onPress={handleProfilePictureUpload}
            className="bg-muted p-4 rounded-xl mb-4 flex-row items-center"
          >
            <View className="w-16 h-16 bg-primary/10 rounded-full mr-4 items-center justify-center">
              <IconSymbol size={32} name="person.fill" color="#AD8AD1" />
            </View>
            <View className="flex-1">
              <Text variant="default" className="font-semibold mb-1">
                Profile Picture
              </Text>
              <Text variant="default" className="text-muted-foreground text-sm">
                Tap to upload a new photo
              </Text>
            </View>
            <IconSymbol size={16} name="chevron.right" color="#999" />
          </TouchableOpacity>

          {/* Username */}
          <TouchableOpacity
            className="bg-muted p-4 rounded-xl mb-4"
            onPress={() => setIsEditingUsername(true)}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text variant="default" className="font-semibold">
                Username
              </Text>
              {!isEditingUsername && (
                <TouchableOpacity
                  onPress={() => setIsEditingUsername(true)}
                  className="p-1"
                >
                  <IconSymbol size={16} name="pencil" color="#AD8AD1" />
                </TouchableOpacity>
              )}
            </View>

            {isEditingUsername ? (
              <View className="flex flex-col gap-y-3">
                <Input
                  value={newUsername}
                  onChangeText={setNewUsername}
                  className="bg-background border border-border rounded-md p-3"
                  placeholder="Enter new username"
                  autoFocus={true}
                />
                <View className="flex flex-row justify-between gap-x-2">
                  <Button
                    onPress={handleUsernameUpdate}
                    disabled={isUpdatingUsername}
                    className="flex-1"
                  >
                    {isUpdatingUsername && (
                      <ActivityIndicator size="small" color="white" />
                    )}
                    <Text>{isUpdatingUsername ? "Saving..." : "Save"}</Text>
                  </Button>
                  <Button
                    onPress={() => {
                      setIsEditingUsername(false);
                      setNewUsername(currentUser?.username || "");
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            ) : (
              <Text variant="default" className="text-muted-foreground">
                {currentUser?.username ||
                  (isPendingProfile
                    ? "Loading..."
                    : "No username found. Please report a bug")}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View className="mb-8">
          <Text
            variant="h3"
            className="text-lg font-semibold mb-4 text-muted-foreground"
          >
            SUPPORT
          </Text>

          <TouchableOpacity
            onPress={handleBugReport}
            className="bg-muted p-4 rounded-xl flex-row items-center"
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full mr-4 items-center justify-center">
              <IconSymbol
                size={20}
                name="exclamationmark.triangle.fill"
                color="#AD8AD1"
              />
            </View>
            <View className="flex-1">
              <Text variant="default" className="font-semibold mb-1">
                Report a Bug
              </Text>
              <Text variant="default" className="text-muted-foreground text-sm">
                Help us improve the app
              </Text>
            </View>
            <IconSymbol size={16} name="chevron.right" color="#999" />
          </TouchableOpacity>
        </View>

        {/* Note about logout */}
        <View className="bg-muted/50 p-4 rounded-xl">
          <View className="flex-row items-center mb-2">
            <IconSymbol size={16} name="info.circle" color="#666" />
            <Text
              variant="default"
              className="ml-2 font-semibold text-muted-foreground"
            >
              Logout Functionality
            </Text>
          </View>
          <Text variant="default" className="text-muted-foreground text-sm">
            Logout functionality is disabled since each account is linked to a
            single device.
          </Text>
        </View>

        {/* Debug Section (Development only) */}
        {__DEV__ && (
          <View className="bg-muted/50 p-4 rounded-xl mt-8">
            <Text variant="default" className="text-muted-foreground text-sm">
              Debug Section
            </Text>
            <Text variant="default" className="text-muted-foreground text-sm">
              User ID: {apiClient.getUserId()}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                await apiClient.clearUserId();
                router.replace("/registration");
              }}
            >
              <Text variant="default" className="text-muted-foreground text-sm">
                Clear Async Storage
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
