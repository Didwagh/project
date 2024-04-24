import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, Image, Switch, Picker } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const SearchUser = () => {
  const [searchName, setSearchName] = useState('');
  const [passoutYear, setPassoutYear] = useState('');
  const [branch, setBranch] = useState('');
  const [alumni, setAlumni] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    try {
      let queryParams = `name=${searchName}`;
      if (alumni) queryParams += `&alumni=true`;
      if (showFilters) {
        queryParams += `&passout=${passoutYear}&branch=${branch}`;
      }
      console.log("Query Params:", queryParams); // Check the constructed query params
      const response = await axios.get(`https://sidesever-1.onrender.com/alumsearch?${queryParams}`);
      const userData = response.data;
      setSearchResults(userData);
      setError('');
    } catch (error) {
      console.error(error);
      setSearchResults([]);
      setError('Error fetching users');
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchName, passoutYear, branch, alumni, showFilters]);

  const handleClear = () => {
    setSearchName('');
    setPassoutYear('2020');
    setBranch('Computer Engineering');
    setAlumni(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
        {searchName.trim() !== '' && (
          <Pressable onPress={handleClear}>
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Alumni:</Text>
          <Switch
            value={alumni}
            onValueChange={setAlumni}
            style={{ marginLeft: 10 }}
          />
        </View>
        <Pressable onPress={toggleFilters}>
          <Text style={{ color: 'blue' }}>Show Filters</Text>
        </Pressable>
      </View>
      {showFilters && (
        <View style={{ padding: 10 }}>
          <Picker
            selectedValue={passoutYear}
            onValueChange={(itemValue) => setPassoutYear(itemValue)}
          >
            {Array.from({ length: 120 }, (_, index) => {
              const year = 2021 - index;
              return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
            })}
          </Picker>
          <Picker
            selectedValue={branch}
            onValueChange={(itemValue) => setBranch(itemValue)}
          >
            <Picker.Item label="Computer Engineering" value="CMPN" />
            <Picker.Item label="Electrical and Telecommunication" value="EXTC" />
          </Picker>
        </View>
      )}
      <Pressable onPress={handleSearch} style={{ alignItems: 'center', padding: 10 }}>
        <Text style={{ color: 'blue' }}>Apply Filters</Text>
      </Pressable>
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
                <Text>{user.name}</Text>
                {/* <Text>year: {user.year}</Text> */}
                <Text>{user.branch}</Text>
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
