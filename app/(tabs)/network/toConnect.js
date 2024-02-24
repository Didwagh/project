import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import UserProfile from "../../../components/UserProfile";

const connection = () => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");

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
            fetchUsers();
        }
    }, [userId]);

    const fetchUsers = async () => {
        axios
            .get(`http://localhost:3000/users/${userId}`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <ScrollView horizontal={false} style={{ width: '100%', height: '100%' }}>
            <FlatList
                scrollEnabled={false}
                data={users}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                numColumns={2}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <UserProfile userId={userId} item={item} key={index} />
                )}
            />
        </ScrollView>
    );
};

export default connection;

const styles = StyleSheet.create({});
