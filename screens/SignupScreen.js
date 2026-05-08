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

export default function SignupScreen({ navigation }) {
  const { switchRole, loading: roleLoading } = useContext(RoleContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState('donor');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name || !phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const user = data.user;

      if (!user) throw new Error('User not created.');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            name,
            phone,
            role: selectedRole,
          },
        ]);

      if (profileError) throw profileError;

      await switchRole(selectedRole);
      navigation.replace('Tabs');

    } catch (err) {
      Alert.alert('Signup Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
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

          <View style={styles.card}>

            <Text style={styles.title}>Create Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Role Selection */}
            <View style={styles.roleContainer}>

              <Pressable
                style={[
                  styles.roleButton,
                  selectedRole === 'donor' && styles.selectedRole,
                ]}
                onPress={() => setSelectedRole('donor')}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === 'donor' && styles.selectedRoleText,
                  ]}
                >
                  Donor
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.roleButton,
                  selectedRole === 'receiver' && styles.selectedRole,
                ]}
                onPress={() => setSelectedRole('receiver')}
              >
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === 'receiver' && styles.selectedRoleText,
                  ]}
                >
                  Receiver
                </Text>
              </Pressable>

            </View>

            <Pressable style={styles.button} onPress={handleSignup}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </Pressable>

            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>
                Already have an account? Login
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
    padding: 20,
    backgroundColor: 'transparent',
  },

  card: {
    backgroundColor: 'rgba(237, 239, 239, 0.95)',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#22c55e',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    backgroundColor: '#fff',
  },

  roleContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },

  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    alignItems: 'center',
  },

  selectedRole: {
    backgroundColor: '#22c55e',
  },

  roleText: {
    fontWeight: 'bold',
    color: '#000',
  },

  selectedRoleText: {
    color: '#fff',
  },

  button: {
    backgroundColor: '#22c55e',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  link: {
    color: '#3b82f6',
    marginTop: 15,
    textAlign: 'center',
  },
});