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

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const router = useRouter();

  const handleSignUp = async () => {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 3) {
      Alert.alert("Error", "Password must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
    } catch (error) {
      Alert.alert("Error", "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign Up to Get Started</Text>
          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={"#999"}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              style={styles.input}
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={"#999"}
              autoComplete="password"
              secureTextEntry
              style={styles.input}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSignUp()}
            >
              {isLoading ? (
                <ActivityIndicator size={24} color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.linkButtonText}>
                Already have an account?
                <Text style={styles.linkButtonTextBold}>Sign In</Text>
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
