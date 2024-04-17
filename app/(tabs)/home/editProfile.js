import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker } from 'react-native'; // Import Picker
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const EditProfile = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState({
    name: '',
    profileImage: '',
    title: '',
    description: '',
    private: false // Add private property to user state
  });
  const [privateValue, setPrivateValue] = useState(false); // State to manage dropdown value

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      fetchUserProfile(userId);
    };

    fetchUser();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`https://server-51or.onrender.com/profile/${userId}`);
      const userData = response.data.user;
      setUser(userData);
      setPrivateValue(userData.private); // Set dropdown value from fetched user data
    } catch (error) {
      console.log('error fetching user profile', error);
    }
  };

  const handleInputChange = (key, value) => {
    setUser(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = { ...user, private: privateValue }; // Include private value in the user object
      const response = await axios.put(`https://server-51or.onrender.com/profile/${userId}`, updatedUser);
      if (response.status === 200) {
        console.log('User info updated successfully');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
    console.log(user)
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.profile}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={user.name}
          onChangeText={text => handleInputChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={user.bio}
          onChangeText={text => handleInputChange('title', text)}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Description"
          multiline
          value={user.description}
          onChangeText={text => handleInputChange('description', text)}
        />
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Private:</Text>
          <Picker
            selectedValue={privateValue}
            style={styles.dropdown}
            onValueChange={(itemValue, itemIndex) => setPrivateValue(itemValue)}>
            <Picker.Item label="Public" value={false} />
            <Picker.Item label="Private" value={true} />
          </Picker>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={{ color: '#fff' }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 25
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
  btn: {
    backgroundColor: '#6452E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 70,
    elevation: 3
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  dropdownLabel: {
    marginRight: 10
  },
  dropdown: {
    height: 50,
    width: 150
  }
});

export default EditProfile;
