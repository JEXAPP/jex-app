import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/themes/colors';

type Props = {
  progress: number; // entre 0 y 1
  label?: string;
};

export const ProgressBar: React.FC<Props> = ({ progress, label }) => {
  const percentage = Math.min(Math.max(progress, 0), 1); // asegurar entre 0 y 1

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label ?? `${Math.round(percentage * 100)}%`}</Text>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${percentage * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.violet2,
    marginBottom: 4,
  },
  barContainer: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.violet2,
  },
});
