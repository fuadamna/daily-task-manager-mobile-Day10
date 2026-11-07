import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { Button, Card, TextInput } from "react-native-paper";
import { auth, db } from "../../firebase";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [success, setSuccess] = useState("");

  // Get users from Firebase
  const getUsers = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        router.replace("/login");
        return;
      }

      const adminDoc = await getDoc(doc(db, "users", currentUser.uid));

      if (!adminDoc.exists() || adminDoc.data().role !== "admin") {
        Alert.alert("Access Denied", "Admin access required.");
        router.replace("/home");
        return;
      }

      const querySnapshot = await getDocs(collection(db, "users"));

      const userArray: any[] = [];

      querySnapshot.forEach((item) => {
        const userData = item.data();

        if (userData.role !== "admin") {
          userArray.push({
            id: item.id,
            ...userData,
          });
        }
      });

      setUsers(userArray);
    } catch (error) {
      Alert.alert("Error", "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Edit user
  const openEdit = (user: any) => {
    setEditingUser(user);
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setError("");
    setSuccess("");
  };

  // Update user
  const handleUpdate = async () => {
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("All fields are required.");
      return;
    }

    if (name.trim().length < 3) {
      setError("Name must contain at least 3 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", editingUser.id), {
        name: name.trim(),
        email: email.trim(),
        phone: phone,
      });

      setEditingUser(null);
      setSuccess("User updated successfully.");

      await getUsers();
    } catch (error) {
      setError("Unable to update user. Please try again.");
    }
  };

  // Open delete confirmation
  const handleDelete = (user: any) => {
    setDeleteUser(user);
    setDeleteError("");
    setSuccess("");
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteUser) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteDoc(doc(db, "users", deleteUser.id));

      setDeleteUser(null);
      setSuccess("User deleted successfully.");

      await getUsers();
    } catch (error) {
      setDeleteError("Unable to delete user. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Unable to logout.");
    }
  };

  // Search and sort
  const filteredUsers = users
    .filter((user) =>
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const first = (a.name || "").toLowerCase();
      const second = (b.name || "").toLowerCase();

      return sortOrder === "asc"
        ? first.localeCompare(second)
        : second.localeCompare(first);
    });

  // Display user card
  const renderUser = ({ item }: { item: any }) => (
    <Card style={styles.userCard}>
      <Card.Content>
        <Text style={styles.userName}>{item.name || "No name"}</Text>

        <Text style={styles.detail}>Email: {item.email || "-"}</Text>

        <Text style={styles.detail}>Phone: {item.phone || "-"}</Text>

        <Text style={styles.role}>Role: {item.role || "user"}</Text>

        <View style={styles.actions}>
          <Button
            mode="contained"
            compact
            onPress={() => openEdit(item)}
            style={styles.editButton}
          >
            Edit
          </Button>

          <Button
            mode="contained"
            compact
            buttonColor="#c0392b"
            onPress={() => handleDelete(item)}
          >
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registered Users</Text>

      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TextInput
        mode="outlined"
        label="Search by name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.search}
      />

      <View style={styles.topButtons}>
        <Button
          mode="outlined"
          onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort: {sortOrder === "asc" ? "A - Z" : "Z - A"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => {
            setSearchTerm("");
            setSortOrder("asc");
            setSuccess("");
          }}
        >
          Reset
        </Button>

        <Button mode="text" onPress={handleLogout}>
          Logout
        </Button>
      </View>

      {loading ? (
        <Text style={styles.empty}>Loading users...</Text>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          ListEmptyComponent={<Text style={styles.empty}>No users found.</Text>}
          contentContainerStyle={{ paddingBottom: 25 }}
        />
      )}

      {/* Update User Modal */}

      <Modal
        visible={!!editingUser}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setEditingUser(null);
          setError("");
        }}
      >
        <View style={styles.modalBackground}>
          <ScrollView contentContainerStyle={styles.modalCard}>
            <Text style={styles.modalTitle}>Update User</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              mode="outlined"
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Phone"
              value={phone}
              onChangeText={(value) =>
                setPhone(value.replace(/[^0-9]/g, "").slice(0, 10))
              }
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleUpdate}
              style={styles.editButton}
            >
              Save Changes
            </Button>

            <Button
              mode="text"
              onPress={() => {
                setEditingUser(null);
                setError("");
              }}
            >
              Cancel
            </Button>
          </ScrollView>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}

      <Modal
        visible={!!deleteUser}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!deleteLoading) {
            setDeleteUser(null);
          }
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.deleteCard}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>

            <Text style={styles.detail}>
              Are you sure you want to delete {deleteUser?.name || "this user"}?
            </Text>

            {deleteError ? (
              <Text style={styles.error}>{deleteError}</Text>
            ) : null}

            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={() => setDeleteUser(null)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                buttonColor="#c0392b"
                onPress={confirmDelete}
                loading={deleteLoading}
                disabled={deleteLoading}
              >
                Delete
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6f8",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#172b4d",
    marginBottom: 14,
  },

  search: {
    backgroundColor: "#ffffff",
  },

  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
    flexWrap: "wrap",
  },

  userCard: {
    backgroundColor: "#ffffff",
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },

  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#172b4d",
    marginBottom: 8,
  },

  detail: {
    color: "#52627a",
    marginTop: 4,
  },

  role: {
    color: "#1769aa",
    marginTop: 6,
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap",
  },

  editButton: {
    backgroundColor: "#1769aa",
  },

  empty: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 30,
  },

  error: {
    color: "#c0392b",
    backgroundColor: "#fdeaea",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  success: {
    color: "#176b3a",
    backgroundColor: "#e5f5e9",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },

  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 22,
    justifyContent: "center",
    flexGrow: 1,
  },

  deleteCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 22,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#172b4d",
    marginBottom: 18,
  },

  input: {
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
});
