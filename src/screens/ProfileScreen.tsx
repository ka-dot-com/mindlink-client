import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useI18n } from '../core/i18n/i18n';
import { useThemeMode } from '../core/theme/theme';

export const ProfileScreen = () => {
  const { t, locale, setLocale, available } = useI18n();
  const { mode, setMode, isDark } = useThemeMode();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('profile_title')}</Text>

      <View style={styles.block}>
        <Text style={styles.label}>{t('language')}</Text>
        <View style={styles.rowWrap}>
          {available.map(l => {
            const active = locale === l;
            return (
              <TouchableOpacity
                key={l}
                onPress={() => setLocale(l)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{l}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>{t('theme')}</Text>
        <View style={styles.rowWrap}>
          {(['light', 'dark', 'system'] as const).map(m => {
            const active = mode === m;
            return (
              <TouchableOpacity
                key={m}
                onPress={() => setMode(m)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{t(m as any)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.helper}>Current: {mode} (dark={String(isDark)})</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24 },
  block: { marginBottom: 32 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10, color: '#334155' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    marginBottom: 8
  },
  pillActive: { backgroundColor: '#2563eb' },
  pillText: { fontSize: 13, color: '#0f172a' },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  helper: { marginTop: 8, fontSize: 12, color: '#64748b' }
});