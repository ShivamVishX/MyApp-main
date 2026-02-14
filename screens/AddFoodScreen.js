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
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { supabase } from '../supabaseClient';

export default function AddFoodScreen({ navigation }) {
  const [foodname, setFoodname] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!foodname || !description || !address || !location) {
      Alert.alert('Error', 'All fields including location are required!');
      return;
    }

    try {
      setLoading(true);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        Alert.alert('Error', 'User not logged in');
        setLoading(false);
        return;
      }

      const user = userData.user;

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
      setFoodname('');
      setDescription('');
      setAddress('');
      setLocation(null);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
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

      <TextInput
        placeholder="Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.mapLabel}>
        Tap on map to select pickup location
      </Text>

      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}   // ✅ Important Fix
        initialRegion={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 8,
          longitudeDelta: 8,
        }}
        onPress={(e) => setLocation(e.nativeEvent.coordinate)}
      >
        {location && (
          <Marker
            coordinate={location}
            title="Pickup Location"
          />
        )}
      </MapView>

      {location && (
        <Text style={styles.coords}>
          📍 Lat: {location.latitude.toFixed(6)} | Lng:{' '}
          {location.longitude.toFixed(6)}
        </Text>
      )}

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
  mapLabel: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  map: {
    height: 220,
    width: '100%',
    borderRadius: 12,
    marginBottom: 10,
  },
  coords: {
    fontSize: 12,
    color: '#555',
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
