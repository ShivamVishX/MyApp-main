// screens/SplashScreen.js
import React, { useEffect, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient';
import { RoleContext } from '../context/RoleContext';

export default function SplashScreen({ navigation }) {
  const { role, setRole } = useContext(RoleContext);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // No logged in user → go to Login
        navigation.replace('Login');
        return;
      }

      // Fetch role if not set
      if (!role) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (data?.role) setRole(data.role);
      }

      // Navigate to TabsSwitcher
      navigation.replace('Tabs');
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});