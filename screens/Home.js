import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { supabase } from '../supabaseClient';

/* ===============================
   Distance Calculator (KM)
================================ */
const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function HomeScreen({ navigation }) {
  const [foodList, setFoodList] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ===============================
     Get User Location
  ================================= */
  const getUserLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        Alert.alert('Location Error', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
        forceRequestLocation: true,
      }
    );
  };

  /* ===============================
     Fetch Food (30 KM Radius)
  ================================= */
  const fetchFood = async () => {
    if (!userLocation) return;

    const { data, error } = await supabase
      .from('foodcollection')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return;

    const nearbyFood = data.filter((food) => {
      if (!food.latitude || !food.longitude) return false;

      const distance = getDistanceInKm(
        userLocation.latitude,
        userLocation.longitude,
        food.latitude,
        food.longitude
      );

      return distance <= 30; // ✅ 30 KM LIMIT
    });

    setFoodList(nearbyFood);
  };

  /* ===============================
     Pull to Refresh
  ================================= */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFood();
    setRefreshing(false);
  };

  /* ===============================
     Effects
  ================================= */
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchFood();
    }
  }, [userLocation]);

  /* 🔄 AUTO REFRESH EVERY 30 SECONDS */
  useEffect(() => {
    if (!userLocation) return;

    const interval = setInterval(() => {
      fetchFood();
    }, 30000); // ⏱ 30 seconds

    return () => clearInterval(interval);
  }, [userLocation]);

  /* ===============================
     UI
  ================================= */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🍱 Available Food</Text>
        <Text style={styles.subtitle}>
          Showing food within 30 km
        </Text>
      </View>

      {/* Food List */}
      <FlatList
        data={foodList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('FoodDetails', { item })
            }
          >
            <Text style={styles.foodName}>{item.foodname}</Text>

            <Text style={styles.foodDesc} numberOfLines={2}>
              {item.description || 'No description provided'}
            </Text>

            <Text style={styles.foodAddress}>
              📍 {item.address}
            </Text>

            {userLocation && (
              <Text style={styles.distance}>
                📏{' '}
                {getDistanceInKm(
                  userLocation.latitude,
                  userLocation.longitude,
                  item.latitude,
                  item.longitude
                ).toFixed(1)}{' '}
                km away
              </Text>
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No food available nearby 😔
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
}

/* ===============================
   Styles
================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#22c55e',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  foodDesc: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  foodAddress: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '500',
  },
  distance: {
    marginTop: 6,
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#9ca3af',
  },
});