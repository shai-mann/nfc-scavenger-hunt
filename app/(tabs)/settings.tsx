import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Here you would handle logout logic
            console.log('Logout pressed');
          },
        },
      ]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will reset all your progress, clues, and scores. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Here you would handle reset logic
            console.log('Reset progress pressed');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange = () => {},
    showArrow = true 
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={styles.settingIcon}>
        <IconSymbol size={24} name={icon} color="#007AFF" />
      </View>
      
      <View style={styles.settingContent}>
        <ThemedText type="defaultSemiBold" style={styles.settingTitle}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText type="default" style={styles.settingSubtitle}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
          thumbColor={switchValue ? '#fff' : '#f4f3f4'}
        />
      ) : showArrow ? (
        <IconSymbol size={20} name="chevron.right" color="#c0c0c0" />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          Settings
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Preferences
          </ThemedText>
          
          <SettingItem
            icon="bell.fill"
            title="Notifications"
            subtitle="Get notified about new clues and updates"
            showSwitch={true}
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon="speaker.wave.2.fill"
            title="Sound Effects"
            subtitle="Play sounds when finding clues"
            showSwitch={true}
            switchValue={soundEnabled}
            onSwitchChange={setSoundEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon="iphone.radiowaves.left.and.right"
            title="Haptic Feedback"
            subtitle="Feel vibrations when interacting"
            showSwitch={true}
            switchValue={hapticEnabled}
            onSwitchChange={setHapticEnabled}
            showArrow={false}
          />
          
          <SettingItem
            icon="moon.fill"
            title="Dark Mode"
            subtitle="Use dark theme for the app"
            showSwitch={true}
            switchValue={darkModeEnabled}
            onSwitchChange={setDarkModeEnabled}
            showArrow={false}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Account
          </ThemedText>
          
          <SettingItem
            icon="person.fill"
            title="Profile"
            subtitle="Edit your username and preferences"
            onPress={() => console.log('Profile pressed')}
          />
          
          <SettingItem
            icon="trophy.fill"
            title="Achievements"
            subtitle="View your badges and accomplishments"
            onPress={() => console.log('Achievements pressed')}
          />
          
          <SettingItem
            icon="chart.bar.fill"
            title="Statistics"
            subtitle="See your hunting statistics"
            onPress={() => console.log('Statistics pressed')}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Game
          </ThemedText>
          
          <SettingItem
            icon="arrow.clockwise"
            title="Reset Progress"
            subtitle="Start fresh with a new adventure"
            onPress={handleResetProgress}
          />
          
          <SettingItem
            icon="questionmark.circle.fill"
            title="Help & Tutorial"
            subtitle="Learn how to play the game"
            onPress={() => console.log('Help pressed')}
          />
          
          <SettingItem
            icon="info.circle.fill"
            title="About"
            subtitle="App version and information"
            onPress={() => console.log('About pressed')}
          />
        </View>

        <View style={styles.section}>
          <SettingItem
            icon="rectangle.portrait.and.arrow.right"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
      </ScrollView>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
});
