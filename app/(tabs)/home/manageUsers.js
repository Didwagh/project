import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/search?query=${searchQuery}`);
      setSearchResult(response.data);
      setError('');
    } catch (error) {
      setSearchResult([]);
      setError('Search failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Enter search query"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ marginBottom: 10, borderWidth: 1, padding: 5, width: 200 }}
      />
      <Button title="Search" onPress={handleSearch} />
      {error ? <Text>{error}</Text> : null}
      {searchResult.length > 0 ? (
        searchResult.map((result, index) => (
          <View key={index}>
            <Text>Name: {result.name}</Text>
            <Text>Email: {result.email}</Text>
            {/* Display other user details as needed */}
          </View>
        ))
      ) : null}
    </View>
  );
}

export default SearchUser;
