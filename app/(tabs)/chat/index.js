import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "expo-router";
import UserChat from "../../../components/UserChat";

const index = () => {
    const [userId, setUserId] = useState("");
    const [connections, setConnections] = useState([]);

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
            fetchConnections();
        }
    }, [userId]);
    const fetchConnections = async () => {
        try {
            const response = await axios.get(
                `https://server-51or.onrender.com/connections/${userId}`
            );
            setConnections(response.data.connections);
        } catch (error) {
            console.log(error);
        }
    };


    return (


        <View>
            <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                {connections?.map((item, index) => (
                    <UserChat key={index} userId={userId} item={item} />
                ))}
            </View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({})