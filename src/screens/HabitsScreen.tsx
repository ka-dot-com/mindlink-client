import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { loadToday, saveDaily } from '../storage/daily';
import { DailyRecord } from '../types/dailyRecord';

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
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const rec = await loadToday();
    setRecord(rec);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleHabit = (id: string) => {
    if (!record) return;
    let updatedHabits: string[];
    if (record.habits.includes(id)) {
      updatedHabits = record.habits.filter((h) => h !== id);
    } else {
      updatedHabits = [...record.habits, id];
    }
    const updated: DailyRecord = {
      ...record,
      habits: updatedHabits,
      form: {
        ...record.form,
        habitsCompleted: String(updatedHabits.length),
      },
    };
    setRecord(updated);
    saveDaily(updated);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (loading || !record) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderText}>Ładowanie nawyków...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mikro‑akcje dnia</Text>
      <FlatList
        data={HABITS}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const done = record.habits.includes(item.id);
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
        Ukończono: {record.habits.length} / {HABITS.length}
        {record.habits.length === 2 && ' – Świetnie! Jeszcze jedna aby zmaksymalizować jutrzejszy Score.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loaderText: { fontSize: 16, color: '#334155' },
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