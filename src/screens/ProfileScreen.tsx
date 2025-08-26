import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil / Ustawienia</Text>
      <Text style={styles.text}>Tu dodamy: logowanie, waga, preferencje powiadomień, wersja aplikacji.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  text: { fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 18 },
});