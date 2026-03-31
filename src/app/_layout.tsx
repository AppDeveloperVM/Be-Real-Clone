import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationGuard />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

function NavigationGuard() {
  const { user } = useAuth(); // Ahora sí estamos dentro del Provider
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Si no hay usuario, manda a login. Si hay, manda a tabs.
    if (!user) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)");
    }
  }, [user]); // SOLO se ejecuta cuando el usuario cambia

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
