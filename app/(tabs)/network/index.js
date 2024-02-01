import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode'
import axios from 'axios';


const index = () => {
const [userId, setUserId] = useState("");
const [user, setUser] = useState("");
const [users, setUsers] = useState([])
useEffect(() => {
  const fecthUser = async() =>{
    try {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId)
      console.log(userId)
      
    } catch (error) {
      console.log("error from netwrok Index ")
    }
  
  }

  fecthUser();

}, [])

//userprofile fetch

useEffect(() => {

  if(userId){
    fetchUserProfile()
  }

}, [userId])

console.log(userId)


const fetchUserProfile = async ()=>{
  try {
    const response = await axios.get(`http://localhost:8081/profile/${userId}`)
    // const response = await axios.get(`http://localhost:3000/profile/${userId}`)
    
    const userData = response.data.user;
    setUserId(userData)
  
  } catch (error) {
    console.log("error NETI USERPROFILE")
  }
}

console.log(user)


  return (
    <View>
      <Text>netwrok</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})