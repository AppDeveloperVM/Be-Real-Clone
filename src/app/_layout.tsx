import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// 1. El RootLayout SOLO envuelve con los Providers
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationGuard />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// 2. Este componente ya tiene acceso a useAuth() porque está "debajo" en el árbol
function NavigationGuard() {
  const { user } = useAuth(); // Asegúrate de tener un estado de carga
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Si no hay usuario y no está en login, al login
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Si hay usuario y sigue en login, a las tabs
      router.replace("/(tabs)");
    }
  }, [user, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
