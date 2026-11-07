import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Button, TextInput } from "react-native-paper";
import { auth, db } from "../../firebase";

export default function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    // Clear previous messages
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setGeneralError("");
    setSuccess("");

    let isValid = true;

    // Name validation
    if (!name.trim()) {
      setNameError("Name is required.");
      isValid = false;
    } else if (name.trim().length < 3) {
      setNameError("Name must contain at least 3 characters.");
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      isValid = false;
    }

    // Phone validation
    if (!phone.trim()) {
      setPhoneError("Phone number is required.");
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(phone)) {
      setPhoneError("Phone number must contain exactly 10 digits.");
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must contain at least 6 characters.");
      isValid = false;
    }

    // Stop registration if validation fails
    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone,
        role: "user",
        createdAt: serverTimestamp(),
      });

      setSuccess("Registration successful!");

      router.replace("/home");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setPasswordError("Password must contain at least 6 characters.");
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.icon}>📝</Text>

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Register to manage your daily activities
          </Text>

          {generalError ? (
            <Text style={styles.generalError}>{generalError}</Text>
          ) : null}

          {/* Name */}
          <TextInput
            label="Full Name"
            mode="outlined"
            value={name}
            onChangeText={(value) => {
              setName(value);
              setNameError("");
            }}
            style={styles.input}
            error={!!nameError}
          />

          {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

          {/* Email */}
          <TextInput
            label="Email Address"
            mode="outlined"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setEmailError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={!!emailError}
          />

          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          {/* Phone */}
          <TextInput
            label="Phone Number"
            mode="outlined"
            value={phone}
            onChangeText={(value) => {
              setPhone(value.replace(/[^0-9]/g, "").slice(0, 10));
              setPhoneError("");
            }}
            keyboardType="number-pad"
            maxLength={10}
            style={styles.input}
            error={!!phoneError}
          />

          {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

          {/* Password */}
          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              setPasswordError("");
            }}
            secureTextEntry
            style={styles.input}
            error={!!passwordError}
          />

          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
          >
            Register
          </Button>

          {success ? <Text style={styles.success}>{success}</Text> : null}

          <Button mode="text" onPress={() => router.replace("/login")}>
            Already have an account? Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 22,
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
    color: "#64748b",
    textAlign: "center",
    marginBottom: 22,
    marginTop: 8,
  },

  input: {
    marginBottom: 4,
    backgroundColor: "#ffffff",
  },

  error: {
    color: "#c0392b",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },

  generalError: {
    color: "#c0392b",
    backgroundColor: "#fdeaea",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  success: {
    color: "#176b3a",
    textAlign: "center",
    marginVertical: 10,
  },

  button: {
    marginTop: 12,
    backgroundColor: "#1769aa",
  },
});
