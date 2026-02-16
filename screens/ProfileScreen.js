// screens/ProfileScreen.js
import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../supabaseClient';
import { RoleContext } from '../context/RoleContext';

export default function ProfileScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const { role, switchRole } = useContext(RoleContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        setEmail(user.email || '');

        const { data, error } = await supabase
          .from('profiles')
          .select('name, phone')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setName(data.name || '');
          setPhone(data.phone || '');
        }
      } catch (err) {
        console.log('Profile fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ name, phone })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated');
      setEditMode(false);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = async () => {
    const newRole = role === 'donor' ? 'receiver' : 'donor';
    await switchRole(newRole);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{email}</Text>

      <Text style={styles.label}>Name</Text>
      {editMode ? (
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      ) : (
        <Text style={styles.value}>{name || 'Not added'}</Text>
      )}

      <Text style={styles.label}>Phone</Text>
      {editMode ? (
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      ) : (
        <Text style={styles.value}>{phone || 'Not added'}</Text>
      )}

      <Text style={styles.label}>Current Role</Text>
      <Text style={styles.value}>
        {role === 'donor' ? 'Donor 🟢' : 'Receiver 🔵'}
      </Text>

      {editMode && (
        <Pressable style={styles.switchButton} onPress={handleRoleSwitch}>
          <Text style={styles.switchText}>
            Switch to {role === 'donor' ? 'Receiver' : 'Donor'}
          </Text>
        </Pressable>
      )}

      {editMode ? (
        <Pressable style={styles.button} onPress={updateProfile}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[styles.button, { backgroundColor: '#3b82f6' }]}
          onPress={() => setEditMode(true)}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </Pressable>
      )}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#22c55e' },
  label: { fontWeight: '600', marginTop: 15 },
  value: { marginTop: 5, fontSize: 16, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 5 },
  switchButton: { marginTop: 10, padding: 10, borderRadius: 6, backgroundColor: '#facc15', alignItems: 'center' },
  switchText: { fontWeight: 'bold' },
  button: { backgroundColor: '#22c55e', padding: 14, borderRadius: 8, marginTop: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logoutButton: { marginTop: 30, alignItems: 'center' },
  logoutText: { color: 'red', fontWeight: 'bold' },
});