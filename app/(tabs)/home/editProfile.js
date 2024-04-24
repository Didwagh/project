import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: '',
    bio: '',
    branch: '',
    passoutYear: '',
    year: '',
    alumni: false
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        console.log(userId)
        const response = await axios.get(`http://localhost:3000/profile/${userId}`);
        setUser(response.data.user);

      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (key, value) => {
    setUser(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/profile/${user._id}`, user);
      if (response.status === 200) {
        console.log('User info updated successfully');
        console.log(user);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      navigation.navigate('(authenticate)'); // Assuming the authentication stack is named '(authenticate)'
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(currentYear - 1900), (val, index) => 1901 + index);

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
            <Text style={styles.dropdownLabel}>Branch:</Text>
            <Picker
              selectedValue={user.branch}
              style={[styles.dropdown, styles.slimPicker]}
              onValueChange={(itemValue, itemIndex) => handleInputChange('branch', itemValue)}>
              <Picker.Item label="Select Branch" value="" />
              <Picker.Item label="Computer Engineering" value="CMPN" />
              <Picker.Item label="Electronics and Telecommunication Engineering" value="EXTC" />
            </Picker>
          </View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Select Year</Text>
            <Picker
              selectedValue={user.year}
              style={[styles.dropdown, styles.slimPicker]}
              onValueChange={(itemValue, itemIndex) => handleInputChange('year', itemValue)}>
              <Picker.Item label="Select Year" value="" />
              <Picker.Item label="FE" value="FE" />
              <Picker.Item label="BE" value="BE" />
              <Picker.Item label="TE" value="TE" />
              <Picker.Item label="SE" value="SE" />
            </Picker>
          </View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Alumni/Student:</Text>
            <Picker
              selectedValue={user.alumni ? 'alumni' : 'student'}
              style={[styles.dropdown, styles.slimPicker]}
              onValueChange={(itemValue, itemIndex) => handleInputChange('alumni', itemValue === 'alumni')}>
              <Picker.Item label="Select Status" value="" />
              <Picker.Item label="Alumni" value="alumni" />
              <Picker.Item label="Student" value="student" />
            </Picker>
          </View>
          {user.alumni && (
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Passout Year:</Text>
              <Picker
                selectedValue={user.passoutYear}
                style={[styles.dropdown, styles.slimPicker]}
                onValueChange={(itemValue, itemIndex) => handleInputChange('passoutYear', itemValue)}>
                <Picker.Item label="Select Passout Year" value="" />
                {years.map((year, index) => (
                  <Picker.Item key={index} label={year.toString()} value={year.toString()} />
                ))}
              </Picker>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btn} onPress={handleSave}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleLogout}>
              <Text style={{ color: '#fff' }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = {
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profile: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    width: '100%',
  },
  slimPicker: {
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
};

export default EditProfile;
