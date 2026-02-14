import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient';

export default function RoleSelectionScreen() {
  const updateRole = async (role) => {
    const user = (await supabase.auth.getUser()).data.user;

    await supabase
      .from('profiles')
      .upsert({ id: user.id, role });

    // 🚫 no navigation here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>

      <Pressable style={styles.button} onPress={() => updateRole('donor')}>
        <Text style={styles.text}>Donor</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => updateRole('receiver')}>
        <Text style={styles.text}>Receiver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});