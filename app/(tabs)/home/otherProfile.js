import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const ProfileCard = () => {
  // State variables
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [adminId, setAdminId] = useState("");
  const [posts, setPosts] = useState([]);
  const [connectionSent, setConnectionSent] = useState(false);
  const [isAdminConnected, setIsAdminConnected] = useState(false);

  // Fetch admin user profile and set adminId
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      setAdminId(userId);
      fetchAdminUserProfile(userId);
    };

    fetchUser();
  }, []);

  // Fetch admin user profile
  const fetchAdminUserProfile = async (userId) => {
    try {
      const response = await axios.get(
        `https://server-51or.onrender.com/profile/${userId}`
      );
      const userData = response.data.user;
      setAdmin(userData);
    } catch (error) {
      console.log("Error fetching admin profile", error);
    }
  };

  // Fetch user profile and posts
  useEffect(() => {
    if (adminId && user) {
      setIsAdminConnected(admin?.connections?.includes(user?._id));
    }
  }, [adminId, user]);

  // Fetch user profile and posts
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [userId]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `https://server-51or.onrender.com/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("Error fetching user profile", error);
    }
  };

  // Fetch user posts
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`https://sidesever-1.onrender.com/post/${userId}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Handle sending connection request
  const sendConnectionRequest = async () => {
    try {
      const response = await fetch(
        "https://server-51or.onrender.com/connection-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId, userId }),
        }
      );

      if (response.ok) {
        setConnectionSent(true);
      }
    } catch (error) {
      console.log("Error sending connection request", error);
    }
  };

  // Handle blocking/unblocking user
  const handleBlock = async () => {
    // Logic for blocking/unblocking user
  };

  // Route parameter
  const route = useRoute();
  const { params } = route;
  const userId = params.userId;

  return (
    <View style={styles.wrapper}>
      {user && (
        <View style={styles.profile}>
          {/* Profile details */}
          <Image
            style={styles.thumbnail}
            source={{ uri: user?.profileImage }}
          />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.title}>{user?.bio}</Text>
          {/* <Text style={styles.description}>Passout Year {user?.passoutYear}</Text> */}

          {/* Connect button */}
          {!isAdminConnected && (
            <Pressable
              onPress={sendConnectionRequest}
              style={styles.connectButton}>
              <Text style={styles.connectButtonText}>
                {connectionSent ? "Pending" : "Connect"}
              </Text>
            </Pressable>
          )}

          {/* Block/Unblock button */}
          {admin?.email === "admin" && (
            <TouchableOpacity style={styles.btn} onPress={handleBlock}>
              <Text style={{ color: "#000" }}>
                {user?.status === "blocked" ? "Block" : "Unblock"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Social icons */}
      {/* <View style={styles.socialIcons}>
        <View style={styles.icon}>
          <TouchableOpacity>
            <Text>Followers</Text>
          </TouchableOpacity>
          <Text style={styles.followers}>44.5k</Text>
        </View>
        <View style={styles.icon}>
          <TouchableOpacity>
            <Text>Following</Text>
          </TouchableOpacity>
          <Text style={styles.followers}>100k</Text>
        </View>
      </View> */}

      {/* User posts */}
      <ScrollView contentContainerStyle={styles.postsContainer}>
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <Image
              source={{
                uri:
                  post.imageUrl ||
                  "https://i.ytimg.com/vi/3SZDBUD0CzE/maxresdefault.jpg",
              }}
              style={styles.postImage}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  postsContainer: {
    marginTop: 25,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  postImage: {
    width: "100%",
    aspectRatio: 1, // Maintain aspect ratio
    borderRadius: 10,
  },
  postContainer: {
    width: "30%", // Adjust the width based on the requirement to have 3 posts per row
    marginBottom: 10,
  },
  wrapper: {
    flex: 1,
    margin: 25,
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
    marginLeft: "auto",
    marginRight: "auto",
    borderWidth: 1,
    borderRadius: 25,
    marginTop: 7,
    paddingHorizontal: 15,
    paddingVertical: 4,
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
  connectButton: {
    backgroundColor: 'white',
    borderColor:"#0072B1",
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#0072B1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileCard;
