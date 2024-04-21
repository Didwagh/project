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
  TouchableOpacity
} from "react-native";

const ProfileCard = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts()
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
      const response = await axios.get(`http://localhost:3000/post/${userId}`);
      setPosts(response.data);
      console.log(posts)
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      <View style={styles.profile}>
        <Image style={styles.thumbnail} resizeMode="contain" source={{ uri: user?.profileImage }} />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.bio}>{user?.bio}</Text>
        <View style={styles.branchYearContainer}>
          <Text style={styles.branchYear}>Branch: {user?.branch}, Year: {user?.year}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleAddTeacher} style={styles.addButton}>
        <Text style={styles.buttonText}>Add Teacher</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBlockUser} style={styles.blockButton}>
        <Text style={styles.buttonText}>Block User</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.postsContainer}>
        {posts.map((post) => (
          <View key={post._id} style={styles.postContainer}>
        
            {post.imageUrl ? (
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            ) : (
              <Text>No Image Available</Text>
            )}
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
    position: "absolute",
    top: 20,
    right: 20,
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
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  blockButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#6452E9",
  },
});

export default ProfileCard;