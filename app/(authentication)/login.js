import { StyleSheet, Text, View, KeyboardAvoidingView, Pressable,TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const login = () => {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const router = useRouter();
    return (
        <SafeAreaView style={{ margin: 20 }}>

            <KeyboardAvoidingView>
                <View style={{ alignItem: "center" }}>
                    <Text style={{ fontSize: 17, fontweight: "bold" }}> Login in to your acc</Text>
                </View>

                <View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 30 }} >
                        <Fontisto name="email" size={24} color="black" />
                        < TextInput
                            style={{ marginLeft: 5 }}
                            value={Email}
                            onChangeText={(text) => setEmail(text)}

                            placeholder="enter your email " />
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 18 }} >
                        <AntDesign name="lock" size={26} color="black" />
                        < TextInput
                            value={Password}
                            onChangeText={(text) => setPassword(text)}

                            secureTextEntry={true}
                            placeholder="enter your password " />
                    </View>

                    <Pressable onPress={ () =>  router.replace('/register')}>
                        <Text>I'm pressable!</Text>
                    </Pressable>


                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>

    )
}

export default login

const styles = StyleSheet.create({})