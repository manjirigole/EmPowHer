import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { firebaseauth } from "@/api/firebase";
import { Colors } from "@/constants/Colors";

const API_URL = "http://192.168.29.237:5000/recommend";

interface Blog {
  title: string;
  // Add other properties of your blog object if available (e.g., content, author)
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const user = firebaseauth.currentUser;
      if (!user) {
        console.log("No user is logged in.");
        setLoading(false);
        return;
      }

      const userId = user.uid;
      console.log("Sending request with:", JSON.stringify({ user_id: userId }));

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: { recommendations?: Blog[] } = await response.json();
        console.log("Received data:", data);

        if (data.recommendations) {
          // Ensure recommendations is an array of Blog objects
          setBlogs(data.recommendations);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const renderBlogCard = ({ item }: { item: Blog }) => (
    <TouchableOpacity style={styles.blogCard}>
      <Text style={styles.blogTitle}>{item.title}</Text>
      {/* You can add more details here if your blog object has them */}
      {/* <Text style={styles.blogContent}>[Brief content preview]</Text> */}
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : blogs.length === 0 ? (
          <Text style={styles.noBlogsText}>No Blogs Available</Text>
        ) : (
          <FlatList
            style={styles.blogList}
            horizontal={true}
            data={blogs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderBlogCard}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.blogListContent}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Blogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 10,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  blogList: {
    flexGrow: 0, // Important for horizontal scrolling
    height: 120, // Adjust height as needed
    marginTop: 20,
  },
  blogListContent: {
    gap: 15,
    paddingRight: 15,
  },
  blogCard: {
    backgroundColor: Colors.secondary[600],
    borderRadius: 10,
    padding: 25,
    width: 250, // Adjust width as needed
    height: "100%",
    justifyContent: "center",
  },
  blogTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  blogContent: {
    fontSize: 14,
    color: Colors.secondary[200],
  },
  noBlogsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
});
