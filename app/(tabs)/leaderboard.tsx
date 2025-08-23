import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Sample leaderboard data
const sampleLeaderboard = [
  { rank: 1, username: 'ScavengerKing', score: 1250, clues: 8 },
  { rank: 2, username: 'HuntMaster', score: 1100, clues: 7 },
  { rank: 3, username: 'ClueFinder', score: 950, clues: 6 },
  { rank: 4, username: 'AdventureSeeker', score: 800, clues: 5 },
  { rank: 5, username: 'PuzzleSolver', score: 650, clues: 4 },
  { rank: 6, username: 'TagHunter', score: 500, clues: 3 },
  { rank: 7, username: 'MysteryLover', score: 350, clues: 2 },
  { rank: 8, username: 'NewExplorer', score: 200, clues: 1 },
];

export default function LeaderboardPage() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#666';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          Leaderboard
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Top Scavenger Hunt Players
        </ThemedText>
      </View>

      <ScrollView style={styles.leaderboardContainer} showsVerticalScrollIndicator={false}>
        {sampleLeaderboard.map((player) => (
          <View key={player.rank} style={styles.playerRow}>
            <View style={styles.rankContainer}>
              <ThemedText type="defaultSemiBold" style={[styles.rank, { color: getRankColor(player.rank) }]}>
                {getRankIcon(player.rank)}
              </ThemedText>
            </View>
            
            <View style={styles.playerInfo}>
              <ThemedText type="defaultSemiBold" style={styles.username}>
                {player.username}
              </ThemedText>
              <ThemedText type="default" style={styles.stats}>
                {player.clues} clues found
              </ThemedText>
            </View>
            
            <View style={styles.scoreContainer}>
              <ThemedText type="defaultSemiBold" style={styles.score}>
                {player.score}
              </ThemedText>
              <ThemedText type="default" style={styles.scoreLabel}>
                pts
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <ThemedText type="default" style={styles.footerText}>
          Keep exploring to climb the ranks!
        </ThemedText>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  leaderboardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 18,
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    opacity: 0.7,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
