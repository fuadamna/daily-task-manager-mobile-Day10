import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#172b4d" },
              headerTintColor: "#ffffff",
              headerTitleStyle: { fontWeight: "bold" },
              contentStyle: { backgroundColor: "#f4f7fc" },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen
              name="registration"
              options={{ title: "Registration" }}
            />
            <Stack.Screen
              name="home"
              options={{ title: "Daily Task Manager" }}
            />
            <Stack.Screen name="about" options={{ title: "About" }} />
            <Stack.Screen
              name="users"
              options={{ title: "Registered Users" }}
            />
          </Stack>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Developed by Amna Fuad | 2026</Text>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#172b4d",
  },
  content: {
    flex: 1,
  },
  footer: {
    backgroundColor: "#172b4d",
    padding: 14,
    alignItems: "center",
  },
  footerText: {
    color: "#ffffff",
    fontSize: 13,
  },
});
