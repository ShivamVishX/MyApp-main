import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Alert.alert('Logged out');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user ? (
        <>
          <Text style={styles.infoText}>
            👤 {user.user_metadata?.name || 'User'}
          </Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </>
      ) : (
        <Text>Loading user info...</Text>
      )}

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  infoText: { fontSize: 18, marginBottom: 5 },
  emailText: { fontSize: 16, color: '#555', marginBottom: 30 },
  button: { backgroundColor: 'red', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
