import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const EditProfile = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState({
    name: '',
    profileImage: '',
    title: '',
    description: '',
    private: false
  });
  const [privateValue, setPrivateValue] = useState(false);
  const [image, setImage] = useState('');

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
      setPrivateValue(userData.private);
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
      const updatedUser = { ...user, private: privateValue };
      const response = await axios.put(`http://localhost:3000/users/${userId}`, updatedUser);
      if (response.status === 200) {
        console.log('User info updated successfully');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    try {
      const { uri } = await FileSystem.getInfoAsync(image);

      if (!uri) {
        throw new Error("Invalid file URI");
      }

      const formData = new FormData();
      formData.append('image', {
        uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post('https://your-upload-url.com', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Image uploaded:', response.data);

      // Update user profile with the image URL
      const updatedUser = { ...user, profileImage: response.data.imageUrl };
      setUser(updatedUser);
    } catch (error) {
      console.log('Error uploading image:', error);
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
          placeholder="Title"
          value={user.title}
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
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 10 }} />}
        <TouchableOpacity style={styles.btn} onPress={pickImage}>
          <Text style={{ color: '#fff' }}>Choose Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={uploadImage}>
          <Text style={{ color: '#fff' }}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={{ color: '#fff' }}>Save</Text>
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
