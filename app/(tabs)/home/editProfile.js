import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useRouter } from "expo-router";

const EditProfile = () => {
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const [user, setUser] = useState({
    name: '',
    bio: '',
    year: '',
    branch: ''
  });

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
      const response = await axios.get(`http://localhost:3000/profile/${userId}`);
      const userData = response.data.user;
      setUser(userData);
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
      const response = await axios.put(`http://localhost:3000/users/${userId}`, user);
      if (response.status === 200) {
        console.log('User info updated successfully');
        console.log(user)
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      router.push("/(authenticate)/login")
      
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ScrollView> 
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
            placeholder="Bio"
            value={user.bio}
            onChangeText={text => handleInputChange('bio', text)}
          />
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Passout Year:</Text>
            <Picker
              selectedValue={user.year}
              style={styles.dropdown}
              onValueChange={(itemValue, itemIndex) => handleInputChange('year', itemValue)}>
              <Picker.Item label="Select Year" value="" />
              <Picker.Item label="FE" value="FE" />
              <Picker.Item label="SE" value="SE" />
              <Picker.Item label="TE" value="TE" />
              <Picker.Item label="BE" value="BE" />
            </Picker>
          </View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Branch:</Text>
            <Picker
              selectedValue={user.branch}
              style={styles.dropdown}
              onValueChange={(itemValue, itemIndex) => handleInputChange('branch', itemValue)}>
              <Picker.Item label="Select Branch" value="" />
              <Picker.Item label="Computer Engineering" value="CMPN" />
              <Picker.Item label="Electronics and Telecommunication Engineering" value="EXTC" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={{ color: '#fff' }}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleLogout}>
            <Text style={{ color: '#fff' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    elevation: 3,
    marginBottom: 10
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
