import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { DEFAULT_TILES } from '../config/tiles';
import { Tile } from '../components/Tile';
import { useI18n } from '../../../core/i18n/i18n';
import { useNavigation } from '@react-navigation/native';

export const DashboardScreen = () => {
  const { t } = useI18n();
  const nav = useNavigation<any>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{t('dashboard_title')}</Text>
      <View style={styles.grid}>
        {DEFAULT_TILES.map(tile => (
          <View key={tile.id} style={styles.cell}>
            <Tile
              title={t(tile.labelKey as any)}
              icon={tile.icon}
              future={tile.future}
              onPress={tile.route ? () => nav.navigate(tile.route) : undefined}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#0f172a' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '50%', paddingRight: 8, marginBottom: 16 }
});