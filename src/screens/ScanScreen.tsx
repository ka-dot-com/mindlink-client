import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export const ScanScreen = () => {
  const onMockScan = () => {
    Alert.alert('Mock Scan', 'Zidentyfikowano: jajka, jogurt, banan.\nBrakuje: źródła omega-3.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vision Scan (Mock)</Text>
      <Text style={styles.text}>Tu w przyszłości zrobimy prawdziwy skan zdjęcia lodówki.</Text>
      <Button title="Wykonaj mock scan" onPress={onMockScan} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  text: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 16 },
});