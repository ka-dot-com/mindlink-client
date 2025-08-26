import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { mockSync, getQueue } from '../storage/syncQueue';

export const ProfileScreen = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);

  const onShowQueue = useCallback(async () => {
    const q = await getQueue();
    Alert.alert('Sync Queue', `Elementów: ${q.length}`);
  }, []);

  const onMockSync = useCallback(async () => {
    setSyncing(true);
    const sent = await mockSync(10);
    setLastResult(sent);
    setSyncing(false);
    Alert.alert('Mock Sync', `Wysłano (udawane): ${sent}`);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil / Ustawienia</Text>
      <Text style={styles.text}>Tu dodamy: logowanie, powiadomienia, wersja aplikacji.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync (Mock)</Text>
        <Button title="Pokaż kolejkę" onPress={onShowQueue} />
        <View style={styles.spacer} />
        <Button title={syncing ? 'Synchronizacja...' : 'Mock Sync 10'} disabled={syncing} onPress={onMockSync} />
        {lastResult !== null && (
          <Text style={styles.result}>Ostatnio wysłano (mock): {lastResult}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  text: { fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 18 },
  section: { marginTop: 32, width: '100%' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  spacer: { height: 12 },
  result: { marginTop: 10, fontSize: 12, color: '#334155' },
});