// screens/SplashScreen.js
import React, { useEffect, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient';
import { RoleContext } from '../context/RoleContext';

export default function SplashScreen({ navigation }) {
  const { loading } = useContext(RoleContext);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigation.replace('Login');
        return;
      }

      if (!loading) {
        navigation.replace('Tabs');
      }
    };

    checkAuth();
  }, [loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22c55e" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});