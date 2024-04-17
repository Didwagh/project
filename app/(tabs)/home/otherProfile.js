import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRoute } from "@react-navigation/native";


const ProfileCard = () => {

  const [user, setUser] = useState();
  const [admin, setAdmin] = useState();
  const [adminId, setAdminId] = useState("");

  



  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      console.log(userId)
      setAdminId(userId);
      fetchadminUserProfile(userId);
      console.log(adminId)
    };

    fetchUser();
  }, []);


  const fetchadminUserProfile = async (userId) => {
    try {
      console.log(userId)
      const response = await axios.get(
        `https://server-51or.onrender.com/profile/${userId}`
      );
      const userData = response.data.user;
      setAdmin(userData)
     console.log(userData)
    } catch (error) {
      console.log("error fetching user profile", error);
    }
  };

  const route = useRoute();
  const { params } = route;
  const userId = params.userId;


  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `https://server-51or.onrender.com/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("error fetching user profile", error);
    }
  };

  return (
    <View style={styles.wrapper}>

      <View style={styles.profile}>
        <Image
          style={styles.thumbnail}
          source={{ uri: user?.profileImage }}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.title}>Front-End Developer</Text>
        <Text style={styles.description}>
          A front-end web developer is responsible for implementing visual
          elements that users.
        </Text>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableOpacity style={styles.btn}>
            <Text style={{ color: "#fff" }}>Follow</Text>
          </TouchableOpacity>



          {admin?.name === "admin" && (
            <TouchableOpacity style={styles.btn}>
              <Text style={{ color: "#fff" }}>Block</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
      <View style={styles.socialIcons}>
        <View style={styles.icon}>
          <TouchableOpacity>
            <Text>Instagram Icon</Text>
          </TouchableOpacity>
          <Text style={styles.followers}>98.5k</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity>
            <Text>Facebook Icon</Text>
          </TouchableOpacity>
          <Text style={styles.followers}>44.5k</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity>
            <Text>YouTube Icon</Text>
          </TouchableOpacity>
          <Text style={styles.followers}>100k</Text>
          <Text>Followers</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 25
  },
  topIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  profile: {
    alignItems: "center",
    marginBottom: 20,
  },
  thumbnail: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    color: "#7C8097",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: "#6452E9",
    paddingVertical: 10,
    marginRight: 30,
    paddingHorizontal: 20,
    borderRadius: 70,
    elevation: 3,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  icon: {
    alignItems: "center",
  },
  followers: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
});

export default ProfileCard;
