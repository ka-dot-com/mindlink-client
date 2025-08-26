import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface InputData {
  sleepHours: number;
  steps: number;
  stressLevel: number; // 1–5
  habitsCompleted: number;
}

function computeNeuroScore(data: InputData) {
  let base = 50;
  if (data.sleepHours >= 7) base += 10;
  if (data.steps >= 8000) base += 10;
  if (data.habitsCompleted >= 2) base += 8;
  if (data.stressLevel <= 2) base += 4;
  return Math.min(100, base);
}

export const HomeScreen = () => {
  const [sleepHours, setSleepHours] = useState('7');
  const [steps, setSteps] = useState('5000');
  const [stressLevel, setStressLevel] = useState('3');
  const [habitsCompleted, setHabitsCompleted] = useState('1');
  const [score, setScore] = useState<number | null>(82);

  const onCalculate = () => {
    const s = computeNeuroScore({
      sleepHours: parseFloat(sleepHours) || 0,
      steps: parseInt(steps) || 0,
      stressLevel: parseInt(stressLevel) || 5,
      habitsCompleted: parseInt(habitsCompleted) || 0,
    });
    setScore(s);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>NeuroScore (placeholder)</Text>
        <Text style={styles.score}>{score ?? '--'}</Text>

        <Text style={styles.sectionTitle}>Dane dnia (manualne na razie):</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Sen (h):</Text>
          <TextInput value={sleepHours} onChangeText={setSleepHours} style={styles.input} keyboardType="decimal-pad" />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kroki:</Text>
          <TextInput value={steps} onChangeText={setSteps} style={styles.input} keyboardType="number-pad" />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Stres (1-5):</Text>
          <TextInput value={stressLevel} onChangeText={setStressLevel} style={styles.input} keyboardType="number-pad" />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Habity ukończone:</Text>
          <TextInput value={habitsCompleted} onChangeText={setHabitsCompleted} style={styles.input} keyboardType="number-pad" />
        </View>
        <Button title="Przelicz Score" onPress={onCalculate} />
        <Text style={styles.hint}>
          To tylko wersja testowa algorytmu. Później dodamy prawdziwe komponenty (sen, HRV, ruch, żywienie, nawyki).
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  score: { fontSize: 64, fontWeight: '700', textAlign: 'center', color: '#2563eb', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  label: { width: 120, fontSize: 14 },
  input: { flex: 1, borderWidth: 1, borderColor: '#94a3b8', padding: 8, borderRadius: 6, fontSize: 14 },
  hint: { fontSize: 12, color: '#475569', marginTop: 16, lineHeight: 16 },
});