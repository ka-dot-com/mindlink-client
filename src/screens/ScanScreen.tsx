import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export const ScanScreen = () => {
  const onMockScan = () => {
    Alert.alert('Mock Scan', 'Detected: eggs, yogurt, banana.\nMissing: omega-3 source.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vision Scan (Mock)</Text>
      <Text style={styles.text}>Future: real fridge photo scan + barcode lookup.</Text>
      <Button title="Run mock scan" onPress={onMockScan} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  text: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 16 }
});