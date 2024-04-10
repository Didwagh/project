import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const SearchUser = () => {
  const [searchName, setSearchName] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/search?name=${searchName}`);
      setSearchResult(response.data);
      console.log(response.data)
      setError('');
    } catch (error) {
      setSearchResult(null);
      setError('User not found');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Enter user name"
        value={searchName}
        onChangeText={setSearchName}
        style={{ marginBottom: 10, borderWidth: 1, padding: 5, width: 200 }}
      />
      <Button title="Search" onPress={handleSearch} />
      {error ? <Text>{error}</Text> : null}
      {searchResult && (
        <View>
          <Text>Name: {searchResult.name}</Text>
          <Text>Email: {searchResult.email}</Text>
          {/* Display other user details as needed */}
        </View>
      )}
    </View>
  );
}

export default SearchUser;
