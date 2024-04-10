import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    Image,
    TextInput,
    Button
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import {jwtDecode} from "jwt-decode";
  import axios from "axios";
  import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
  import { SimpleLineIcons } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  
  import moment from "moment";
  import { useRouter } from "expo-router";

const AdminPanel = () => {
    const router = useRouter();
  const handleManageUsers = () => {
    // Navigate to manage users screen or perform related action
    console.log('Manage Users');
  };

  const handleManagePosts = () => {
    // Navigate to manage posts screen or perform related action
    console.log('Manage Posts');
  };

  const handleAddTeacher = () => {
    // Navigate to add teacher screen or perform related action
    console.log('Add Teacher');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Admin Panel</Text>
      <Button title="Manage Users"  onPress={() => router.push("/home/manageUsers")}/>
      <Button title="Manage Posts" onPress={handleManagePosts} />
      <Button title="Add Teacher" onPress={handleAddTeacher} />
    </View>
  );
}

export default AdminPanel;