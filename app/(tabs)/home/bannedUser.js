import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://sidesever-1.onrender.com/users');
        const userData = response.data;
        setUsers(userData);
        setError('');
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Users List</Text>
      </View>
      {/* Users list */}
      <View style={{ flex: 1 }}>
        {users.length > 0 ? (
          users.map((user, index) => (
            <Pressable
              key={index}
              onPress={() => router.push({ pathname: "/home/otherProfile", params: { userId: user._id } })}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
            >
              <Image source={{ uri: user.profileImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png" }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
              <View>
                <Text>Name: {user.name}</Text>
                <Text>Year: {user.year}</Text>
                <Text>Branch: {user.branch}</Text>
              </View>
            </Pressable>
          ))
        ) : (
          <Text>No users found</Text>
        )}
        {error ? <Text>{error}</Text> : null}
      </View>
    </View>
  );
};

export default UsersList;
