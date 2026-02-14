// components/TabsSwitcher.js
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RoleContext } from '../context/RoleContext';
import { supabase } from '../supabaseClient';

// Screens
import HomeScreen from '../screens/Home';
import AddFoodScreen from '../screens/AddFoodScreen';
import PostScreen from '../screens/MyPostsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// Donor Tabs
function DonorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Donor Home') iconName = 'home';
          else if (route.name === 'Add Food') iconName = 'add-circle';
          else if (route.name === 'My Posts') iconName = 'list';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Donor Home" component={HomeScreen} />
      <Tab.Screen name="Add Food" component={AddFoodScreen} />
      <Tab.Screen name="My Posts" component={PostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Receiver Tabs
function ReceiverTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Available Food') iconName = 'home';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Available Food" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// TabsSwitcher
export default function TabsSwitcher() {
  const { role, setRole } = useContext(RoleContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.role && data.role !== role) setRole(data.role);
      } catch (err) {
        console.log('Error fetching role:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading || !role) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return role === 'donor' ? <DonorTabs /> : <ReceiverTabs />;
}