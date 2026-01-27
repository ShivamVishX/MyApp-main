import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FoodDetailsScreen({ route }) {
  // Safe access to avoid crashes
  const item = route?.params?.item;

  // If nothing was passed, show fallback
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No food details available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.foodname}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text>{item.description}</Text>
      <Text style={styles.label}>Address:</Text>
      <Text>{item.address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  label: { fontWeight: 'bold', marginTop: 10 },
  errorText: { textAlign: 'center', color: 'red', fontSize: 16 },
});
