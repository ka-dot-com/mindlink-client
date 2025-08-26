import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { computeNeuroScore } from '../lib/score';
import { DayInputData } from '../types/day';
import { saveJSON, loadJSON } from '../storage/async';

const FORM_KEY = 'day_form_v1';

export const HomeScreen = () => {
  const [sleepHours, setSleepHours] = useState('7');
  const [steps, setSteps] = useState('5000');
  const [stressLevel, setStressLevel] = useState('3');
  const [habitsCompleted, setHabitsCompleted] = useState('0');
  const [score, setScore] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Wczytaj zapisane dane formularza
  useEffect(() => {
    (async () => {
      const data = await loadJSON(FORM_KEY, {
        sleepHours: '7',
        steps: '5000',
        stressLevel: '3',
        habitsCompleted: '0',
      });
      setSleepHours(data.sleepHours);
      setSteps(data.steps);
      setStressLevel(data.stressLevel);
      setHabitsCompleted(data.habitsCompleted);
      setLoaded(true);
    })();
  }, []);

  // Zapisuj formularz przy zmianie (debounce uproszczony)
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      saveJSON(FORM_KEY, {
        sleepHours,
        steps,
        stressLevel,
        habitsCompleted,
      });
    }, 400);
    return () => clearTimeout(t);
  }, [sleepHours, steps, stressLevel, habitsCompleted, loaded]);

  const onCalculate = useCallback(() => {
    const payload: DayInputData = {
      sleepHours: parseFloat(sleepHours) || 0,
      steps: parseInt(steps) || 0,
      stressLevel: parseInt(stressLevel) || 5,
      habitsCompleted: parseInt(habitsCompleted) || 0,
    };
    setScore(computeNeuroScore(payload));
  }, [sleepHours, steps, stressLevel, habitsCompleted]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>NeuroScore</Text>
        <Text style={styles.score}>{score ?? '--'}</Text>

        <Text style={styles.sectionTitle}>Dane dnia:</Text>
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
          Dane i formularz zapisują się lokalnie. Po restarcie app zachowa wartości (AsyncStorage).
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