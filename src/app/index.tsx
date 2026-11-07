import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth, db } from "../../firebase";

export default function Index() {
  const [destination, setDestination] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setDestination("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const role = userDoc.data().role;

          if (role === "admin") {
            setDestination("/users");
          } else if (role === "user") {
            setDestination("/home");
          } else {
            setDestination("/login");
          }
        } else {
          setDestination("/login");
        }
      } catch (error) {
        setDestination("/login");
      }
    });

    return unsubscribe;
  }, []);

  if (!destination) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1769aa" />
      </View>
    );
  }

  return <Redirect href={destination as any} />;
}
