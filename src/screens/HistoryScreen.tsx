import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DailyRecord {
  date: string;
  habits?: string[];
  score?: number | null;
  updatedAt?: string;
}

interface HistoryItem {
  key: string;
  record: DailyRecord | null;
}

const LIMIT = 30;

async function listDailyKeys(): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  return keys
    .filter(k => k.startsWith('daily_'))
    .sort()
    .reverse();
}

async function loadRecord(key: string): Promise<DailyRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as DailyRecord;
  } catch {
    return null;
  }
}

export const HistoryScreen = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const keys = await listDailyKeys();
    const slice = keys.slice(0, LIMIT);
    const arr: HistoryItem[] = [];
    for (const k of slice) {
      const rec = await loadRecord(k);
      arr.push({ key: k, record: rec });
    }
    setItems(arr);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (loading && items.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyExtractor={item => item.key}
        ListHeaderComponent={<Text style={styles.title}>History (daily_*)</Text>}
        renderItem={({ item }) => {
          const rec = item.record;
          const date = item.key.replace('daily_', '');
          if (!rec) {
            return (
              <View style={styles.rowMissing}>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.missing}>No data</Text>
              </View>
            );
          }
          return (
            <View style={styles.row}>
              <View style={styles.colLeft}>
                <Text style={styles.date}>{rec.date}</Text>
                <Text style={styles.meta}>
                  Habits: {rec.habits ? rec.habits.length : 0} | Score: {rec.score ?? '--'}
                </Text>
              </View>
              <View style={styles.colRight}>
                <Text style={styles.score}>{rec.score ?? '--'}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Empty</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loaderText: { fontSize: 14, color: '#475569' },
  container: { flex: 1, padding: 12, paddingTop: 4 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  rowMissing: {
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10
  },
  date: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  meta: { fontSize: 12, color: '#475569', marginTop: 4 },
  missing: { fontSize: 13, color: '#b91c1c', marginTop: 4 },
  colLeft: { flex: 1 },
  colRight: { paddingLeft: 12 },
  score: { fontSize: 20, fontWeight: '700', color: '#2563eb' },
  empty: { textAlign: 'center', marginTop: 40, color: '#64748b' }
});