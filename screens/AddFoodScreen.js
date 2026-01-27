import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

export default function AddFoodScreen({ navigation }) {
  const [foodname, setFoodname] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!foodname || !description || !address) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      setLoading(true);

      // ✅ Get the logged-in user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const user = userData.user;

      // ✅ Insert the food post with the user's ID
      const { data, error } = await supabase
        .from('foodcollection')
        .insert([
          {
            foodname,
            description,
            address,
            posted_by: user.id, // ✅ important field for MyPostsScreen
          },
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Food shared successfully!');
      setFoodname('');
      setDescription('');
      setAddress('');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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

      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sharing...' : 'Share'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: { backgroundColor: '#22c55e', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
