import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { computeNeuroScore } from '../lib/score';
import { DayInputData } from '../types/day';
import { loadToday, saveDaily, migrateIfNeeded } from '../storage/daily';
import { DailyRecord } from '../types/dailyRecord';

export const HomeScreen = () => {
  const [record, setRecord] = useState<DailyRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Load + migrate
  useEffect(() => {
    (async () => {
      await migrateIfNeeded();
      const today = await loadToday();
      setRecord(today);
      setLoading(false);
    })();
  }, []);

  const updateForm = (key: keyof DailyRecord['form'], value: string) => {
    if (!record) return;
    const updated = { ...record, form: { ...record.form, [key]: value } };
    setRecord(updated);
  };

  // Debounced save of form
  useEffect(() => {
    if (!record) return;
    const t = setTimeout(() => {
      saveDaily(record);
    }, 400);
    return () => clearTimeout(t);
  }, [record]);

  const onCalculate = useCallback(() => {
    if (!record) return;
    const payload: DayInputData = {
      sleepHours: parseFloat(record.form.sleepHours) || 0,
      steps: parseInt(record.form.steps) || 0,
      stressLevel: parseInt(record.form.stressLevel) || 5,
      habitsCompleted: parseInt(record.form.habitsCompleted) || 0,
    };
    const score = computeNeuroScore(payload);
    const updated = { ...record, score };
    setRecord(updated);
    saveDaily(updated);
  }, [record]);

  if (loading || !record) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderText}>Ładowanie dnia...</Text>
      </View>
    );
  }

  const f = record.form;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>NeuroScore</Text>
        <Text style={styles.score}>{record.score ?? '--'}</Text>
        <Text style={styles.date}>{record.date}</Text>

        <Text style={styles.sectionTitle}>Dane dnia:</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Sen (h):</Text>
          <TextInput value={f.sleepHours} onChangeText={(v) => updateForm('sleepHours', v)} style={styles.input} keyboardType="decimal-pad" />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kroki:</Text>
          <TextInput value={f.steps} onChangeText={(v) => updateForm('steps', v)} style={styles.input} keyboardType="number-pad" />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Stres (1-5):</Text>
          <TextInput value={f.stressLevel} onChangeText={(v) => updateForm('stressLevel', v)} style={styles.input} keyboardType="number-pad" />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Habity ukończone (liczba):</Text>
          <TextInput value={f.habitsCompleted} onChangeText={(v) => updateForm('habitsCompleted', v)} style={styles.input} keyboardType="number-pad" />
        </View>
        <Button title="Przelicz Score" onPress={onCalculate} />
        <Text style={styles.hint}>
          Rekord dnia zapisany lokalnie. Nowy dzień = nowy rekord. Migracja ze starych kluczy wykonuje się 1 raz.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loaderText: { fontSize: 16, color: '#334155' },
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  date: { fontSize: 14, textAlign: 'center', color: '#64748b', marginBottom: 16 },
  score: { fontSize: 64, fontWeight: '700', textAlign: 'center', color: '#2563eb', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { width: 140, fontSize: 14 },
  input: { flex: 1, borderWidth: 1, borderColor: '#94a3b8', padding: 8, borderRadius: 6, fontSize: 14 },
  hint: { fontSize: 12, color: '#475569', marginTop: 16, lineHeight: 16 },
});