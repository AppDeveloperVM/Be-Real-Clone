import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      router.push("/(tabs)");
    } catch (error: any) {
      const message = error?.message || error?.toString() || "";

      if (message) {
        // Error genérico para casos inesperados
        Alert.alert(
          "Error en el registro",
          "No pudimos iniciar sesión. Comprueba las credenciales.",
        );
        console.error("Error original:", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to Continue</Text>
          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"#999"}
              keyboardType="email-address"
              autoComplete="email"
              onChangeText={setEmail}
              value={email}
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={"#999"}
              autoComplete="password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              {isLoading ? (
                <ActivityIndicator size={24} color="#fff" />
              ) : (
                <Text style={styles.buttonText}>SignIn</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.replace("/(auth)/signup")}
            >
              <Text style={styles.linkButtonText}>
                Don't have an account?
                <Text style={styles.linkButtonTextBold}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: "#666",
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#666",
    fontSize: 14,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  linkButtonTextBold: {
    fontWeight: "600",
    color: "#000",
  },
});
