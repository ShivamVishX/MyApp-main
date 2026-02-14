import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function FoodDetailsScreen({ route }) {
  const item = route?.params?.item;

  // Fallback if no data
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No food details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Food Info */}
      <Text style={styles.title}>{item.foodname}</Text>

      <Text style={styles.label}>Description</Text>
      <Text style={styles.text}>
        {item.description || 'No description provided'}
      </Text>

      <Text style={styles.label}>Address</Text>
      <Text style={styles.text}>{item.address}</Text>

      {/* Map Section */}
      {item.latitude && item.longitude && (
        <>
          <Text style={styles.label}>Location</Text>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={null} // ✅ IMPORTANT: enables OpenStreetMap
              initialRegion={{
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.foodname}
                description={item.address}
              />
            </MapView>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#374151',
  },
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
});
