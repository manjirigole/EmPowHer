import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/api/firebase";
import { Colors } from "@/constants/Colors";

type BlogData = {
  id: string;
  title: string;
  imageUrl: string;
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogList: BlogData[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Extract title and imageUrl dynamically
          const [title, imageUrl] = Object.entries(data)[0];
          return {
            id: doc.id,
            title: title || "Untitled Blog",
            imageUrl: imageUrl || "https://example.com/placeholder.jpg",
          };
        });
        setBlogs(blogList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const renderItem = ({ item }: { item: BlogData }) => {
    console.log("rendering item:", item);
    const backgroundColor = item.id === selectedId ? "#F0F0F0" : "#FFFFFF"; // Highlight selected item
    const color = item.id === selectedId ? "black" : "gray";

    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        style={[styles.item, { backgroundColor }]}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={[styles.title, { color }]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={blogs}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.blogCard}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Blogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  blogCard: {
    padding: 10,
    backgroundColor: Colors.pink[300],
    borderRadius: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginHorizontal: 10,
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  item: {
    padding: 10,
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    width: 150,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
