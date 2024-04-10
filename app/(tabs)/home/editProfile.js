import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { AiOutlineClose } from 'react-icons/ai';

export default function ProfileEdit({ onEdit }) {
  const [editInputs, setEditInputs] = useState({
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

  const getInput = (name, value) => {
    setEditInputs({ ...editInputs, [name]: value });
  };

  const updateProfileData = () => {
    // Handle saving data (you can add this functionality later with API calls)
    console.log('Profile data updated:', editInputs);
    onEdit();
  };

  return (
    <View style={styles.profileCard}>
      <View style={styles.editBtn}>
        <TouchableOpacity onPress={onEdit}>
          {/* <AiOutlineClose size={25} /> */}
        </TouchableOpacity>
      </View>
      <View style={styles.profileEditInputs}>
        <InputLabel label="Name">
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={editInputs.name}
            onChangeText={(text) => getInput('name', text)}
          />
        </InputLabel>
        <InputLabel label="Headline">
          <TextInput
            style={styles.input}
            placeholder="Headline"
            value={editInputs.headline}
            onChangeText={(text) => getInput('headline', text)}
          />
        </InputLabel>
        {/* Add other input fields similarly */}
      </View>
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={updateProfileData}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const InputLabel = ({ label, children }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  profileCard: {
    padding: 20,
    backgroundColor: '#fff',
  },
  editBtn: {
    alignItems: 'flex-end',
  },
  profileEditInputs: {
    marginTop: 20,
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
  saveContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  saveBtn: {
    width: 300,
    height: 50,
    backgroundColor: '#0073b1',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
