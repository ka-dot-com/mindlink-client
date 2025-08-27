import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  icon: string;
  onPress?: () => void;
  future?: boolean;
}

export const Tile = ({ title, icon, onPress, future }: Props) => {
  return (
    <TouchableOpacity style={[styles.tile, future && styles.future]} onPress={onPress} disabled={!!future}>
      <View style={styles.iconBox}>
        <Ionicons name={icon as any} size={24} color="#2563eb" />
      </View>
      <Text style={styles.title}>{title}{future ? ' (soon)' : ''}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    aspectRatio: 1.1,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between'
  },
  future: {
    opacity: 0.55
  },
  iconBox: {
    backgroundColor: '#e0edff',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a'
  }
});