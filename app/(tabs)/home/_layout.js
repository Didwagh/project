import {Stack} from "expo-router";

export default function Layout (){
    return (
        <Stack>
            <Stack.Screen name="index"  options={{headerShown: false}} />
            <Stack.Screen name="profile"  options={{headerShown: false}} />
            <Stack.Screen name="admin"  options={{headerShown: false}} />
            <Stack.Screen name="Search"  options={{headerShown: false}} />
            <Stack.Screen name="editProfile"  options={{title: "UpdateProfile"}} />
            <Stack.Screen name="otherProfile"  options={{headerShown: false}} />
        </Stack>
    )
   
}