import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "../../../firebase";
import axios from "axios";
import { useRouter } from "expo-router";

const index = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");
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

  // fetch image function is added
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginVertical: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Entypo name="circle-with-cross" size={24} color="black" />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={{
                uri: "https://media.licdn.com/dms/image/D5603AQFeh_NknN-g3Q/profile-displayphoto-shrink_400_400/0/1689263297492?e=1703116800&v=beta&t=jl59Svp5msDE8_VQat4kFFZLGUm1RPTyRK3IMMJrxpg",
              }}
            />
            <Text style={{ fontWeight: "500" }}>Anyone</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginRight: 8,
          }}
        >
          <Entypo name="back-in-time" size={24} color="black" />
          <Pressable
            // onPress={createPost}
            style={{
              padding: 10,
              backgroundColor: "#0072b1",
              borderRadius: 20,
              width: 80,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Post
            </Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        style={{
          flexDirection: "coloumn",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        <Pressable
          onPress={pickImage}
          style={{
            widt: 40,
            height: 40,
            marginTop: 15,
            backgroundColor: "#E0E0E0",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="perm-media" size={24} color="black" />
        </Pressable>

        <Text>Media</Text>
      </Pressable>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({})