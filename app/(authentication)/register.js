import { StyleSheet, Text, View, KeyboardAvoidingView, Pressable,Alert,TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';

const register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();
    
    const handleReg =()=>{
        const user = {
            name:name,
            email:email,
            password:Password,
        }

        axios.post("http://localhost:3000/register",user).then ((response) => {
            console.log(response);
            Alert.alert("succesfull");
        })
           
        
    }




    return (
        <SafeAreaView style={{ margin: 20 }}>

            <KeyboardAvoidingView>
                <View style={{ alignItem: "center" }}>
                    <Text style={{ fontSize: 17, fontweight: "bold" }}> create your acc</Text>
                </View>

                <View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 30 }} >
                    <Ionicons name="people" size={24} color="black" />
                        < TextInput
                            style={{ marginLeft: 5 }}
                            value={name}
                            onChangeText={(text) => setName(text)}

                            placeholder="enter your Name " />
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 30 }} >
                        <Fontisto name="email" size={24} color="black" />
                        < TextInput
                            style={{ marginLeft: 5 }}
                            value={email}
                            onChangeText={(text) => setEmail(text)}

                            placeholder="enter your email " />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 18 }} >
                        <AntDesign name="lock" size={26} color="black" />
                        < TextInput
                            value={password}
                            onChangeText={(text) => setPassword(text)}

                            secureTextEntry={true}
                            placeholder="enter your password " />
                    </View>

                    <Pressable 
                    style={{ 
                        flexDirection:"row-reverse",
                        marginTop:5,
                        marginBottom:60
                        
                    }}
                    onPress={ () =>  router.replace('/login')}>
                        <Text style={{
                            color:"white",
                            backgroundColor:"blue"
                        }}>I Alredy Have Accout!</Text>
                    </Pressable>

                    <Pressable 
                    style={{ 
                        flexDirection:"row",
                        alignSelf:"center"
                        
                    }}
                    onPress={handleReg}>
                        <Text style={{
                            color:"white",
                            backgroundColor:"blue"
                        }}>Sing Up</Text>
                    </Pressable>
                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>

    )}

export default register

const styles = StyleSheet.create({})