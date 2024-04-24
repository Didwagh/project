import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, Image } from 'react-native';
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
        const response = await axios.get(`https://sidesever-1.onrender.com/search?name=${searchName}`);
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
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <Pressable onPress={() => router.push("/(tabs)/home")}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
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
      <View style={{ flex: 1 }}>
        {searchResults.length > 0 ? (
          searchResults.map((user, index) => (
            <Pressable
              key={index}
              onPress={() => router.push({ pathname: "/home/otherProfile", params: { userId: user._id } })}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
            >
              <Image source={{ uri: user.profileImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png" }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
              <View>
                <Text>Name: {user.name}</Text>
                <Text>year: {user.year}</Text>
                <Text>branch: {user.branch}</Text>
              </View>
            </Pressable>
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
