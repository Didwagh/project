import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ Headershown: false }} />
            <Stack.Screen name="register" options={{ Headershown: false }} />
        </Stack>


    )

}