import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

interface Habit {
  id: string;
  name: string;
  category: string;
}

const HABITS: Habit[] = [
  { id: 'morning_light', name: 'Poranne światło 5 min', category: 'light' },
  { id: 'box_breath', name: 'Box breathing 2 min', category: 'breath' },
  { id: 'post_meal_walk', name: 'Spacer po posiłku 10 min', category: 'movement' },
];

export const HabitsScreen = () => {
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleHabit = (id: string) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mikro‑akcje dnia</Text>
      <FlatList
        data={HABITS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const done = completed.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.habit, done && styles.habitDone]}
              onPress={() => toggleHabit(item.id)}
            >
              <Text style={[styles.habitText, done && styles.habitTextDone]}>
                {done ? '✓ ' : ''}{item.name}
              </Text>
              <Text style={styles.category}>{item.category}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <Text style={styles.footer}>
        Ukończono: {completed.length} / {HABITS.length}
        {completed.length === 2 && ' – Świetnie! Jeszcze jedna aby zmaksymalizować jutrzejszy Score.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 12 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  habit: {
    padding: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  habitDone: { backgroundColor: '#2563eb' },
  habitText: { fontSize: 14, color: '#0f172a' },
  habitTextDone: { color: '#fff', fontWeight: '600' },
  category: { fontSize: 12, color: '#475569', marginTop: 4 },
  footer: { marginTop: 12, fontSize: 13, color: '#334155' },
});