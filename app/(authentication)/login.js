import { StyleSheet, Text, View, KeyboardAvoidingView, Pressable,TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    return (
        <SafeAreaView style={{ margin: 20 }}>

            <KeyboardAvoidingView>
                <View style={{alignSelf: "center" }}>
                    <Text > Login in to your acc</Text>
                </View>

                <View>
                <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#E0E0E0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <Fontisto
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 18 : 18,
              }}
              placeholder="enter your Email"
            />
          </View>


          <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#E0E0E0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                style={{ marginLeft: 8 }}
                name="lock1"
                size={24}
                color="gray"
              />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 18 : 18,
                }}
                placeholder="enter your Password"
              />
            </View>


                    <Pressable
        //  onPress={handleRegister}
            style={{
              width: 200,
              marginVertical: 20,
              backgroundColor: "#0072b1",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Register
            </Text>
          </Pressable>
          
          <Pressable 
          style={{ alignSelf:"center",
          marginVertical: 10,
          }}
          onPress={() =>  router.replace('/register')}>
                        <Text>I'm pressable!</Text>
                    </Pressable>


                </View>


            </KeyboardAvoidingView>
        </SafeAreaView>

    )
}

export default login

const styles = StyleSheet.create({})