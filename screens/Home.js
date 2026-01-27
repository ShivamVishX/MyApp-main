import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { supabase } from '../supabaseClient';

export default function HomeScreen({ navigation }) {
  const [foodList, setFoodList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFood = async () => {
    const { data, error } = await supabase
      .from('foodcollection')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setFoodList(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFood();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFood();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🍱 Available Food</Text>
        <Text style={styles.subtitle}>Find freshly shared food near you</Text>
      </View>

      {/* Food List */}
      <FlatList
        data={foodList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('FoodDetails', { item })}
          >
            <Text style={styles.foodName}>{item.foodname}</Text>
            <Text style={styles.foodDesc} numberOfLines={2}>
              {item.description || 'No description provided.'}
            </Text>
            <Text style={styles.foodAddress}>📍 {item.address}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No food available right now 😔</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // light background
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3, // Android shadow
  },
  foodName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 5,
  },
  foodDesc: {
    color: '#4b5563',
    fontSize: 14,
    marginBottom: 8,
  },
  foodAddress: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#9ca3af',
  },
});
