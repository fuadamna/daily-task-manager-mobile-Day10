import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button, TextInput } from "react-native-paper";
import { auth, db } from "../../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === "admin") {
          router.replace("/users");
        } else if (role === "user") {
          router.replace("/home");
        } else {
          Alert.alert("Error", "Invalid user role.");
        }
      } else {
        Alert.alert("Error", "User details not found in database.");
      }
    } catch (error) {
      Alert.alert("Login Failed", "Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.icon}>📋</Text>

        <Text style={styles.title}>Daily Task Manager</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <TextInput
          label="Email Address"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          Login
        </Button>

        <Button mode="text" onPress={() => router.push("/registration")}>
          Don't have an account? Register
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 18,
    elevation: 3,
  },
  icon: {
    fontSize: 45,
    textAlign: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#172b4d",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: 25,
    marginTop: 8,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#1769aa",
  },
});
