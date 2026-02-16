import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { supabase } from '../supabaseClient';

export default function AddFoodScreen({ navigation }) {
  const [foodname, setFoodname] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOCATION PERMISSION ================= */
  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'App needs your location to share food',
        buttonPositive: 'OK',
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  /* ================= GET CURRENT LOCATION ================= */
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location permission required');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        setAddress('Current Location');
      },
      error => {
        console.log(error);
        Alert.alert(
          'Location Error',
          `${error.code}: ${error.message}\n\nPlease turn ON GPS & High Accuracy`
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,              // 🔥 increased
        maximumAge: 0,
        forceRequestLocation: true,  // 🔥 CRITICAL
        showLocationDialog: true,    // 🔥 forces GPS ON popup
      }
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!foodname || !description || !address || !location) {
      Alert.alert('Error', 'All fields including location are required!');
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const { error } = await supabase.from('foodcollection').insert([
        {
          foodname,
          description,
          address,
          latitude: location.latitude,
          longitude: location.longitude,
          posted_by: user.id,
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Food shared successfully!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Share Food</Text>

      <TextInput
        placeholder="Food Name"
        style={styles.input}
        value={foodname}
        onChangeText={setFoodname}
      />

      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <GooglePlacesAutocomplete
        placeholder="Search Address"
        fetchDetails
        onPress={(data, details = null) => {
          if (!details) return;
          setAddress(data.description);
          setLocation({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          });
        }}
        query={{
          key: 'YOUR_GOOGLE_MAPS_API_KEY',
          language: 'en',
        }}
        styles={{ textInput: styles.input }}
      />

      <Pressable style={styles.locationBtn} onPress={getCurrentLocation}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Use My Current Location
        </Text>
      </Pressable>

      <MapView
        style={styles.map}
        region={
          location
            ? { ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 }
            : {
                latitude: 20.5937,
                longitude: 78.9629,
                latitudeDelta: 5,
                longitudeDelta: 5,
              }
        }
      >
        {location && <Marker coordinate={location} />}
      </MapView>

      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Share</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  locationBtn: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  map: {
    height: 220,
    width: '100%',
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
