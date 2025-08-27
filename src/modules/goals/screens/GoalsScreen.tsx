import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Button } from 'react-native';
import { useI18n } from '../../../core/i18n/i18n';
import { loadUserProfile, saveUserProfile, computeTargets } from '../storage';
import { PrimaryGoalKey, UserProfile } from '../../user/types';

const GOALS: { key: PrimaryGoalKey; labelKey: string }[] = [
  { key: 'weight_loss', labelKey: 'goals_primary_weight_loss' },
  { key: 'muscle_gain', labelKey: 'goals_primary_muscle_gain' },
  { key: 'stress_reduction', labelKey: 'goals_primary_stress_reduction' },
  { key: 'sleep_better', labelKey: 'goals_primary_sleep_better' },
  { key: 'cycle_balance', labelKey: 'goals_primary_cycle_balance' },
  { key: 'habit_formation', labelKey: 'goals_primary_habit_formation' }
];

export const GoalsScreen = () => {
  const { t } = useI18n();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState<'low' | 'moderate' | 'high'>('moderate');

  useEffect(() => {
    (async () => {
      const p = await loadUserProfile();
      setProfile(p);
      if (p.weightKg) setWeight(String(p.weightKg));
      if (p.heightCm) setHeight(String(p.heightCm));
      if (p.activityLevel) setActivity(p.activityLevel);
      setLoading(false);
    })();
  }, []);

  const chooseGoal = useCallback(
    (g: PrimaryGoalKey) => {
      if (!profile) return;
      const targets = computeTargets(g, profile.weightKg);
      const updated: UserProfile = { ...profile, primaryGoal: g, targets };
      setProfile(updated);
      saveUserProfile(updated);
      Alert.alert(t('goal_saved'));
    },
    [profile, t]
  );

  const saveMetrics = () => {
    if (!profile) return;
    const weightNum = parseFloat(weight) || undefined;
    const heightNum = parseFloat(height) || undefined;
    const updated: UserProfile = {
      ...profile,
      weightKg: weightNum,
      heightCm: heightNum,
      activityLevel: activity
    };
    if (updated.primaryGoal) {
      updated.targets = computeTargets(updated.primaryGoal, updated.weightKg);
    }
    setProfile(updated);
    saveUserProfile(updated);
    Alert.alert(t('targets_saved'));
  };

  if (loading || !profile) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('select_goal')}</Text>
      <View style={styles.goalsWrap}>
        {GOALS.map(g => {
          const active = profile.primaryGoal === g.key;
          return (
            <TouchableOpacity
              key={g.key}
              style={[styles.goalBtn, active && styles.goalBtnActive]}
              onPress={() => chooseGoal(g.key)}
            >
              <Text style={[styles.goalText, active && styles.goalTextActive]}>
                {t(g.labelKey as any)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Biometrics</Text>
      <View style={styles.field}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
        />
      </View>

      <Text style={styles.label}>Activity</Text>
      <View style={styles.rowWrap}>
        {(['low', 'moderate', 'high'] as const).map(a => {
          const active = activity === a;
          return (
            <TouchableOpacity
              key={a}
              style={[styles.activityBtn, active && styles.activityBtnActive]}
              onPress={() => setActivity(a)}
            >
              <Text style={[styles.activityText, active && styles.activityTextActive]}>
                {a}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 16 }}>
        <Button title={t('save')} onPress={saveMetrics} />
      </View>

      {profile.targets && (
        <>
          <Text style={styles.sectionTitle}>{t('daily_targets')}</Text>
            <View style={styles.targetBox}>
              <Text>{t('steps')}: {profile.targets.steps}</Text>
              <Text>{t('water')}: {profile.targets.waterMl}</Text>
              <Text>{t('calories')}: {profile.targets.calories}</Text>
              <Text>{t('protein')}: {profile.targets.proteinG}</Text>
            </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, paddingBottom: 120 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  goalsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  goalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    marginBottom: 8
  },
  goalBtnActive: { backgroundColor: '#2563eb' },
  goalText: { fontSize: 12, color: '#0f172a' },
  goalTextActive: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  field: { marginBottom: 14 },
  label: { fontSize: 13, marginBottom: 4, color: '#334155' },
  input: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 8,
    padding: 10,
    fontSize: 14
  },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  activityBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8
  },
  activityBtnActive: { backgroundColor: '#2563eb' },
  activityText: { fontSize: 12, color: '#0f172a' },
  activityTextActive: { color: '#fff', fontWeight: '600' },
  targetBox: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12
  }
});