import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const handleRegister = () => {
    const user = {
      email,
      password,
      verified: true,
    };

    axios
      .post("https://sidesever-1.onrender.com/regteacher", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered successfully"
        );
        // Handle navigation logic after successful registration
        setEmail("");
        setPassword("");
        // Reset other form fields if needed
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred while registering"
        );
        console.log("Registration failed", error);
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <KeyboardAvoidingView>
        <View style={{ marginTop: 50 }}>
          <View style={styles.inputContainer}>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="Enter Email"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={styles.input}
              placeholder="Enter Password"
            />
          </View>
          {/* Other input fields can be added similarly */}

          <Pressable onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Add Teacher</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
  },
  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 18,
    paddingHorizontal: 8,
  },
  button: {
    width: 200,
    backgroundColor: "lightblue",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
    marginTop: 30,
  },
  buttonText: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Register;
