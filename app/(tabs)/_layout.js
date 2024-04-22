import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="black" />
            ) : (
              <AntDesign name="home" size={24} color="black" />
            ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          tabBarLabel: "",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FontAwesome name="connectdevelop" size={24} color="black" />
            ) : (
              <FontAwesome name="connectdevelop" size={24} color="black" />
            ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          tabBarLabel: "",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialIcons name="post-add" size={24} color="black" />
            ) : (
              <MaterialIcons name="post-add" size={24} color="black" />
            ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: "",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="chat" size={24} color="black" />
            ) : (
              <Entypo name="chat" size={24} color="black" />
            ),
        }}
      />

      <Tabs.Screen
        name="best"
        options={{
          tabBarLabel: "",
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Feather name="award" size={24} color="black" />
            ) : (
              <Feather name="award" size={24} color="black" />
            ),
        }}
      />
    </Tabs>
  );
}