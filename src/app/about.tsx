import { StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";

export default function About() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.icon}>ℹ️</Text>

          <Text style={styles.title}>About Daily Task Manager</Text>

          <Text style={styles.description}>
            Daily Task Manager is a simple application designed to help users
            organize their daily activities and manage tasks efficiently.
          </Text>

          <Text style={styles.heading}>✓ Easy to Use</Text>
          <Text style={styles.detail}>Simple and user-friendly interface.</Text>

          <Text style={styles.heading}>✓ Stay Organized</Text>
          <Text style={styles.detail}>
            Keep your daily activities organized.
          </Text>

          <Text style={styles.heading}>✓ Mobile Friendly</Text>
          <Text style={styles.detail}>Designed for mobile screens.</Text>
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    elevation: 3,
  },
  icon: {
    fontSize: 45,
    textAlign: "center",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#172b4d",
    textAlign: "center",
    marginVertical: 15,
  },
  description: {
    color: "#64748b",
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 20,
  },
  heading: {
    color: "#1769aa",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 12,
  },
  detail: {
    color: "#64748b",
    marginTop: 4,
  },
});
