import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { supabase } from '../supabaseClient';
import { RoleContext } from '../context/RoleContext';

export default function LoginScreen({ navigation }) {
  const { switchRole, loading: roleLoading } = useContext(RoleContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData?.role) {
        await switchRole(profileData.role);
      }

      navigation.replace('Tabs');
    } catch (err) {
      Alert.alert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (roleLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../components/images/loginimage.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
     
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🍱 Share Food</Text>
            <Text style={styles.subtitle}>Help reduce food waste</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable style={styles.button} onPress={handleLogin}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}>
                Don't have an account? Sign up
              </Text>
            </Pressable>
          </View>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
  },

  subtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },

  button: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  link: {
    textAlign: 'center',
    marginTop: 18,
    color: '#3b82f6',
    fontWeight: '500',
  },
});