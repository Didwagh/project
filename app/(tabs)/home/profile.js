import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";

const ProfileCard = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  // const [postts, setPostts] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      console.log(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      router.replace("/login"); // Assuming the authentication stack is named '(authenticate)'
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleEditProfile = () => {
    router.push("/home/editProfile");
  };

  const handleAddTeacher = () => {
    router.push("/home/admin");
  };

  const handleBlockUser = () => {
    router.push("/home/bannedUser");
  };

  const fetchUserPosts = async () => {
    try {
      console.log(userId);
      const response = await axios.get(`http://localhost:3000/post/${userId}`);
      const postData = response.data;

      setPosts(postData);
      console.log(post);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      
      <View style={styles.profile}>
        <Image
          style={styles.thumbnail}
          resizeMode="contain"
          source={{ uri: user?.profileImage }}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.bio}>{user?.bio}</Text>

        <View style={styles.branchYearContainer}>
          <Text style={styles.branchYear}>
            Branch: {user?.branch}, Year: {user?.year}
          </Text>
        </View>
        <View style={styles.branchYearContainer}>
          <Text style={styles.branchYear}>
            Total Connections : {user?.connections.length}
          </Text>
        </View>
      </View>

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

      <View style={styles.feed}></View>

      {user?.email === "admin" && (
        <TouchableOpacity onPress={handleAddTeacher} style={styles.addButton}>
          <Text>Add Teacher</Text>
        </TouchableOpacity>
      )}

      {user?.email === "admin" && (
        <TouchableOpacity onPress={handleBlockUser} style={styles.blockButton}>
          <Text>Block User</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleLogout} style={styles.blockButton}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.postsContainer}>
        {posts.map((post, index) => (
          <View key={index} style={styles.postContainer}>
            <Image
              source={{
                uri: post?.imageUrl
                  ? post.imageUrl
                  : "https://i.ytimg.com/vi/3SZDBUD0CzE/maxresdefault.jpg",
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  editButton: {
    backgroundColor: "lightblue",
    position: "absolute",
    top: 20,
    right: 20,
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  profile: {
    marginTop: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  thumbnail: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    backgroundColor:"gray",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  branchYearContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  branchYear: {
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'lightblue',
    color: '#fff',
    padding: 10,
    textAlign: 'center',
  },
  blockButton: {
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'lightblue',
    color: '#fff',
    padding: 10,
    textAlign: 'center',
  },

  socialIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    paddingHorizontal: 50,
    alignItems: "center",
  },
  followers: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
  postContainer: {
    width: "30%", // Adjust the width based on the requirement to have 3 posts per row
    marginBottom: 10,
  },
});

export default ProfileCard;
