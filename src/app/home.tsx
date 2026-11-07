import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import { auth } from "../../firebase";

export default function Home() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Unable to logout.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.icon}>📋</Text>

        <Text style={styles.title}>Daily Task Manager</Text>

        <Text style={styles.subtitle}>
          Organize your daily activities and manage your tasks easily.
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.heading}>Welcome!</Text>

          <Text style={styles.description}>
            Your account is ready. Stay organized and manage your daily
            activities.
          </Text>

          <Button
            mode="contained"
            onPress={() => router.push("/about")}
            style={styles.button}
          >
            About Us
          </Button>

          <Button mode="outlined" onPress={handleLogout} style={styles.logout}>
            Logout
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  hero: {
    backgroundColor: "#dceaff",
    padding: 28,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 22,
  },
  icon: {
    fontSize: 55,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#172b4d",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    color: "#52627a",
    textAlign: "center",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    elevation: 2,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#172b4d",
  },
  description: {
    color: "#64748b",
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1769aa",
    marginTop: 8,
  },
  logout: {
    marginTop: 12,
  },
});
