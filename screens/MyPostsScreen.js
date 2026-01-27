import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../supabaseClient';

export default function MyPostsScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // ✅ Get the current logged-in user safely
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        Alert.alert('Error', 'User not logged in');
        setLoading(false);
        return;
      }

      const user = userData.user;

      // ✅ Fetch only posts that belong to the user
      const { data, error } = await supabase
        .from('foodcollection')
        .select('*')
        .eq('posted_by', user.id)
        .order('id', { ascending: false }); // optional: show latest first

      if (error) throw error;

      setPosts(data || []);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('foodcollection').delete().eq('id', id);
          if (error) {
            Alert.alert('Error', error.message);
          } else {
            Alert.alert('Deleted!');
            fetchPosts();
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Shared Foods</Text>
      {posts.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>
          No posts yet.
        </Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.foodName}>{item.foodname}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.addr}>{item.address}</Text>
              <Pressable onPress={() => deletePost(item.id)}>
                <Text style={{ color: 'red', marginTop: 8 }}>Delete</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  foodName: { fontSize: 18, fontWeight: 'bold' },
  desc: { fontSize: 14, color: '#555', marginTop: 4 },
  addr: { fontSize: 13, color: '#666', marginTop: 2 },
});
