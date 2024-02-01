import { Tabs } from "expo-router";
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen name="home" option={{
                tabBarLabel: "Home",
                headerShown: false,
                tabBarIcon:({focused})=> focused?(  
                    <Entypo name="home" size={24} color="black" />
                ) : (   <Entypo name="home" size={24} color="black" />)
            }} />


            <Tabs.Screen name="network" option={{
                tabBarLabel: "network",
                headerShown: false,
                tabBarIcon: <Ionicons name="people" size={24} color="black" />
            }} />


            <Tabs.Screen name="post" option={{
                tabBarLabel: "post",
                headerShown: false,
                tabBarIcon: <AntDesign name="pluscircleo" size={24} color="black" />
            }} />
        </Tabs>
    )
}