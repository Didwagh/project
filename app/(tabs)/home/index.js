import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Ionicons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useRouter } from "expo-router";

const Index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);

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
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `https://server-51or.onrender.com/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);

      // if(userData.status != `blocked` ) {

      //   router.replace("/blocked")
      // }else{
      // }
    } catch (error) {
      console.log("error fetching user profile", error);
    }
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get(
          "https://server-51or.onrender.com/all"
        );
        setPosts(response.data.posts);
        // console.log(posts)
      } catch (error) {
        console.log("error fetching posts", error);
      }
    };
    fetchAllPosts();
  }, [posts]);

  const MAX_LINES = 2;
  const [showfullText, setShowfullText] = useState(false);

  const toggleShowFullText = () => {
    setShowfullText(!showfullText);
  };

  const [isLiked, setIsLiked] = useState(false);

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `https://server-51or.onrender.com/like/${postId}/${userId}`
      );
      if (response.status === 200) {
        const updatedPost = response.data.post;
        setIsLiked(updatedPost.likes.some((like) => like.user === userId));
      }
    } catch (error) {
      console.log("Error liking/unliking the post", error);
    }
  };

  // const deletePost = (postId) => {
  //   Alert.alert(
  //     "Delete Post",
  //     "Are you sure you want to delete this post?",
  //     [
  //       {
  //         text: "Cancel",
  //         style: "cancel"
  //       },
  //       {
  //         text: "Delete",
  //         onPress: async () => {
  //           try {
  //             const response = await axios.delete(`http://localhost:3000/posts/${postId}`);
  //             if (response.status === 200) {
  //               console.log('Post deleted successfully');
  //               // Additional actions after successful deletion, such as updating the UI
  //             } else {
  //               console.log('Failed to delete post');
  //               // Handle other status codes if needed
  //             }
  //           } catch (error) {
  //             console.error('Error deleting post:', error);
  //             // Handle error
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };

  const deletePost = async (postId) => {
    try {
      // Confirm with the admin before deleting the post
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmDelete) return; // If admin cancels, exit the function

      const response = await axios.delete(
        `https://sidesever-1.onrender.com/posts/${postId}`
      );
      if (response.status === 200) {
        console.log("Post deleted successfully");
      } else {
        console.log("Failed to delete post");
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      // Handle error
    }
  };

  const router = useRouter();

  return (
    <ScrollView stickyHeaderIndices={[0]}>

      <View
        style={{
          backgroundColor:"lightblue",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}>
        <Pressable onPress={() => router.push("/home/profile")}>
          <Image
            style={{ width: 30, height: 30, borderRadius: 15, backgroundColor:"gray" }}
            source={{ uri: user?.profileImage }}
          />
        </Pressable>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 30,
            flex: 1,
          }}
          onPress={() => router.push("/home/Search")}>
          <AntDesign
            style={{ marginLeft: 10 }}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput placeholder="Search" />
        </Pressable>
        {/* <Ionicons name="chatbox-ellipses-outline" size={24} color="black" /> */}
      </View>

      <View>
        {posts?.map((item, index) => (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
              }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/home/otherProfile",
                      params: { userId: item?.user?._id },
                    })
                  }>
                  <Image
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                    source={{ uri: item?.user?.profileImage }}
                  />
                </Pressable>
                <View style={{ flexDirection: "column", gap: 2 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>
                    {item?.user?.name}
                  </Text>
                  {/* <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      width: 230,
                      color: "gray",
                      fontSize: 15,
                      fontWeight: "400",
                    }}>{user?.bio}
                    
                  </Text> */}
                  <Text style={{ color: "gray" }}>
                    {moment(item.createdAt).format("MMMM Do YYYY")}
                  </Text>
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                {user?.email === "admin" && (
                  <Pressable onPress={() => deletePost(item._id)}>
                    <Feather name="x" size={20} color="black" />
                  </Pressable>
                )}
                <Entypo name="dots-three-vertical" size={20} color="black" />
              </View>
            </View>
            <View
              style={{ marginTop: 10, marginHorizontal: 10, marginBottom: 12 }}>
              <Text
                style={{ fontSize: 15 }}
                numberOfLines={showfullText ? undefined : MAX_LINES}>
                {item?.description}
              </Text>
              {!showfullText && (
                <Pressable onPress={toggleShowFullText}>
                  <Text>See more</Text>
                </Pressable>
              )}
            </View>

            {item?.imageUrl && (
              <Image
                style={{ width: "100%", height: 240 }}
                source={{ uri: item.imageUrl }}
              />
            )}
            {item?.likes?.length > 0 && (
              <View
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}>
                <SimpleLineIcons name="like" size={16} color="#0072b1" />
                <Text style={{ color: "gray" }}>{item?.likes?.length}</Text>
              </View>
            )}
            <View
              style={{ height: 2, borderColor: "#E0E0E0", borderWidth: 2 }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginVertical: 10,
              }}>
              <Pressable onPress={() => handleLikePost(item?._id)}>
                <AntDesign
                  style={{ textAlign: "center" }}
                  name="like2"
                  size={24}
                  color={isLiked ? "#0072b1" : "gray"}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: isLiked ? "#0072b1" : "gray",
                    marginTop: 2,
                  }}>
                  Like
                </Text>
              </Pressable>
              <Pressable>
                <FontAwesome
                  name="comment-o"
                  size={20}
                  color="gray"
                  style={{ textAlign: "center" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 2,
                    fontSize: 12,
                    color: "gray",
                  }}>
                  Comment
                </Text>
              </Pressable>
              <Pressable>
                <FontAwesome
                  name="share-square-o"
                  size={20}
                  color="gray"
                  style={{ textAlign: "center" }}
                />
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    textAlign: "center",
                    color: "gray",
                  }}>
                  Repost
                </Text>
              </Pressable>
              <Pressable>
                <Feather name="send" size={20} color="gray" />
                <Text style={{ marginTop: 2, fontSize: 12, color: "gray" }}>
                  Send
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({});
