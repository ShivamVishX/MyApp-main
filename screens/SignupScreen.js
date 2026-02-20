// screens/SignupScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Pressable, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../supabaseClient';
import { RoleContext } from '../context/RoleContext';

export default function SignupScreen({ navigation }) {
  const { setRole } = useContext(RoleContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState('donor'); // default
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name || !phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create auth user
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const userId = data.user.id;

      // 2️⃣ Insert profile with role
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: userId, name, phone, role: selectedRole }]);

      if (profileError) throw profileError;

      // 3️⃣ Update context
      switchrole(selectedRole);

      // 4️⃣ Navigate to tabs
      navigation.replace('Tabs');

    } catch (err) {
      Alert.alert('Signup Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <Pressable
          style={[
            styles.roleButton,
            selectedRole === 'donor' && { backgroundColor: '#22c55e' },
          ]}
          onPress={() => setSelectedRole('donor')}
        >
          <Text style={styles.roleText}>Donor</Text>
        </Pressable>

        <Pressable
          style={[
            styles.roleButton,
            selectedRole === 'receiver' && { backgroundColor: '#22c55e' },
          ]}
          onPress={() => setSelectedRole('receiver')}
        >
          <Text style={styles.roleText}>Receiver</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 15 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 },
  roleButton: { padding: 12, borderRadius: 8, backgroundColor: '#ddd', flex: 1, marginHorizontal: 5, alignItems: 'center' },
  roleText: { color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: '#22c55e', padding: 14, borderRadius: 8, marginTop: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#3b82f6', marginTop: 15, textAlign: 'center' },
});