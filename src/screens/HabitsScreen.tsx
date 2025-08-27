import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { saveJSON, loadJSON } from '../core/storage/async';

interface Habit {
  id: string;
  name: string;
  category: string;
}

const HABITS: Habit[] = [
  { id: 'morning_light', name: 'Morning light 5 min', category: 'light' },
  { id: 'box_breath', name: 'Box breathing 2 min', category: 'breath' },
  { id: 'post_meal_walk', name: 'Post‑meal walk 10 min', category: 'movement' }
];

const STORAGE_KEY = 'habits_completed_v1';

export const HabitsScreen = () => {
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await loadJSON<string[]>(STORAGE_KEY, []);
      setCompleted(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveJSON(STORAGE_KEY, completed);
    }
  }, [completed, loading]);

  const toggleHabit = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const data = await loadJSON<string[]>(STORAGE_KEY, []);
    setCompleted(data);
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Micro‑Habits</Text>
      <FlatList
        data={HABITS}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const done = completed.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.habit, done && styles.habitDone]}
              onPress={() => toggleHabit(item.id)}
              disabled={loading}
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
        Completed: {completed.length} / {HABITS.length}
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
    marginBottom: 10
  },
  habitDone: { backgroundColor: '#2563eb' },
  habitText: { fontSize: 14, color: '#0f172a' },
  habitTextDone: { color: '#fff', fontWeight: '600' },
  category: { fontSize: 12, color: '#475569', marginTop: 4 },
  footer: { marginTop: 12, fontSize: 13, color: '#334155' }
});