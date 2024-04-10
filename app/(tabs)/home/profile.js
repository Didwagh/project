import React, { useState } from 'react';
import { View, Text, Image, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ProfilePage = () => {
  // Dummy data for the grid of images
  const images = [
    { id: '1', uri: 'https://via.placeholder.com/150' },
    { id: '2', uri: 'https://via.placeholder.com/150' },
    { id: '3', uri: 'https://via.placeholder.com/150' },
    { id: '4', uri: 'https://via.placeholder.com/150' },
    { id: '5', uri: 'https://via.placeholder.com/150' },
    { id: '6', uri: 'https://via.placeholder.com/150' },
    { id: '7', uri: 'https://via.placeholder.com/150' },
    { id: '8', uri: 'https://via.placeholder.com/150' },
    { id: '9', uri: 'https://via.placeholder.com/150' },
  ];

  const [editMode, setEditMode] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: 'John Doe',
    headline: 'Software Engineer',
    country: 'USA',
    city: 'New York',
    company: 'ABC Inc.',
    industry: 'Technology',
    college: 'XYZ University',
    website: 'https://example.com',
    aboutMe: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    skills: 'React Native, JavaScript, HTML, CSS',
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (key, value) => {
    setProfileInfo({ ...profileInfo, [key]: value });
  };

  const saveProfile = () => {
    // Handle saving profile data here
    console.log('Profile data saved:', profileInfo);
    toggleEditMode(); // Switch back to view mode after saving
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{profileInfo.name}</Text>
          <Text style={styles.bio}>{profileInfo.headline}</Text>
        </View>
      </View>

      {editMode ? (
        <View style={styles.profileEditInputs}>
          <InputLabel label="Name">
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={profileInfo.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </InputLabel>
          <InputLabel label="Headline">
            <TextInput
              style={styles.input}
              placeholder="Headline"
              value={profileInfo.headline}
              onChangeText={(text) => handleInputChange('headline', text)}
            />
          </InputLabel>
          {/* Add other input fields similarly */}
        </View>
      ) : null}

      <View style={styles.actionContainer}>
        {editMode ? (
          <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editBtn} onPress={toggleEditMode}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={images}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const InputLabel = ({ label, children }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bio: {
    color: '#666',
  },
  profileEditInputs: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  editBtn: {
    width: 300,
    height: 50,
    backgroundColor: '#0073b1',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    width: 300,
    height: 50,
    backgroundColor: '#0073b1',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    width: '33.333%',
    aspectRatio: 1, // Maintain aspect ratio for images
  },
});

export default ProfilePage;
