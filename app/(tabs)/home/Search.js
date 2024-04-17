import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";


const SearchUser = () => {
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();


  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/search?name=${searchName}`);
        const userData = response.data;
        setSearchResults(userData);
        setError('');
      } catch (error) {
        console.error(error);
        setSearchResults([]);
        setError('Error fetching users');
      }
    };

    if (searchName.trim() !== '') {
      handleSearch();
    } else {
      // Clear search results and error if searchName is empty
      setSearchResults([]);
      setError('');
    }
  }, [searchName]);

  // Function to handle clearing the input field
  const handleClear = () => {
    setSearchName('');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Container for search input and buttons */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        {/* Back button */}
        <Pressable onPress={() => router.push("/(tabs)/home")}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>

        {/* Search input */}
        <TextInput
          placeholder="Enter user name"
          value={searchName}
          onChangeText={setSearchName}
          style={{ flex: 1, marginLeft: 10, marginRight: 10, borderWidth: 1, padding: 5 }}
        />

        {/* Clear button */}
        {searchName.trim() !== '' && (
          <Pressable onPress={handleClear}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
        )}
      </View>

      {/* Search results */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {searchResults.length > 0 ? (
          searchResults.map((user, index) => (
            <View key={index}>
              <Pressable onPress={() => router.push({ pathname: "/home/otherProfile", params: { userId: user._id } })}>
                <Text>Name: {user.name}</Text>
                <Text>Email: {user.email}</Text>
              </Pressable>
              {/* Display other user details as needed */}
            </View>
          ))
        ) : (
          searchName.trim() !== '' && <Text>No users found</Text>
        )}
        {error ? <Text>{error}</Text> : null}
      </View>
    </View>
  );
}

export default SearchUser;
