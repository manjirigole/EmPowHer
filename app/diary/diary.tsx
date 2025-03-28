import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/fonts";
import CurrentDate from "@/components/CurrentDate";
import { db } from "@/api/firebase";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

const Diary = () => {
  const [entries, setEntries] = useState<
    { id: string; date: Timestamp | null; text: string; userId: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "diaryEntries"),
        where("userId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => {
        const date = doc.data().date;
        return {
          id: doc.id,
          date: date instanceof Timestamp ? date : null,
          text: doc.data().text,
          userId: doc.data().userId,
        };
      });

      data.sort((a, b) => {
        if (a.date && b.date) {
          return b.date.toMillis() - a.date.toMillis();
        } else if (a.date) {
          return -1;
        } else if (b.date) {
          return 1;
        } else {
          return 0;
        }
      });
      setEntries(data);
    } catch (error) {
      console.log("Error fetching diary entries: ", error);
    }
    setLoading(false);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Ionicons
                name="chevron-back-outline"
                style={styles.backIcon}
                onPress={() => router.back()}
              ></Ionicons>
              <View>
                <Text style={styles.headerDiary}> My Diary</Text>
              </View>
            </View>
            <View style={styles.currentDate}>
              <CurrentDate />
            </View>
            {loading ? (
              <Text>Loading...</Text>
            ) : entries.length === 0 ? (
              <Text style={styles.noEntries}>No diary entries found.</Text>
            ) : (
              <FlatList
                data={entries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.entry}>
                    <Text style={styles.date}>
                      {item.date
                        ? item.date.toDate().toLocaleDateString()
                        : "No Date"}
                    </Text>
                    <Text style={styles.text}>{item.text}</Text>
                  </View>
                )}
                contentContainerStyle={[
                  styles.flatListContent, // Apply existing contentContainerStyle
                  { backgroundColor: Colors.primary }, // Add the background color here
                ]}
              />
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Diary;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    padding: 10,
    flex: 1,
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingLeft: 20,
    alignItems: "center",
  },
  headerDiary: {
    fontSize: 20,
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cbold,
  },
  backIcon: {
    color: Colors.primary_pink800,
    fontSize: 30,
  },
  currentDate: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  noEntries: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cbold,
  },
  entry: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    backgroundColor: Colors.pink[300],
    marginBottom: 10,
    borderRadius: 5,
  },
  date: {
    fontFamily: Fonts.cbold,
    fontSize: 15,
    color: Colors.secondary[900],
  },
  text: {
    marginTop: 5,
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cmedium,
    fontSize: 17,
  },
  flatListContent: {
    paddingBottom: 20, // Keep any existing padding
  },
});
