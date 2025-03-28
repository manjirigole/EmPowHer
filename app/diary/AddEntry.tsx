import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomButton from "@/components/CustomButton";
import { db } from "@/api/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Fonts } from "@/constants/fonts";
import { useState } from "react";
import axios from "axios";

const AddEntry = () => {
  const [entryText, setEntryText] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleSaveEntry = async () => {
    if (!user) {
      Alert.alert("Authentication Error", "Please log in to add an entry.");
      return;
    }

    if (!entryText.trim()) {
      Alert.alert("Empty Entry", "Please enter some text");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "diaryEntries"), {
        userId: user.uid,
        text: entryText,
        date: Timestamp.now(),
      });

      // Analyze sentiment
      const sentimentResponse = await axios.post(
        "http://192.168.29.237:5000/analyze",
        { text: entryText }
      );
      const sentiment = sentimentResponse.data;

      // Update Firestore with sentiment
      await updateDoc(doc(db, "diaryEntries", docRef.id), {
        sentiment: sentiment,
      });

      Alert.alert("Success", "Entry saved successfully!");
      setEntryText(""); //clear the input after saving
      router.back(); //navigate back to the diary page
    } catch (error) {
      console.log("Error adding entry:", error);
      Alert.alert("Error", "Failed to save entry. Please try again");
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView>
          <View>
            <Text style={styles.entryHeader}>Add an Entry</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Type your diary entry here..."
              value={entryText}
              onChangeText={setEntryText}
            />
            <View style={styles.btnView}>
              <CustomButton
                title="Save Entry"
                handlePress={handleSaveEntry}
                style={styles.buttonStyle}
                textStyle={styles.btnTextStyles}
              />
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AddEntry;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    padding: 10,
    alignContent: "center",
  },
  entryHeader: {
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cbold,
    fontSize: 20,
    padding: 10,
  },
  input: {
    backgroundColor: Colors.pink[300],
    borderRadius: 5,
    padding: 10,
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cmedium,
    fontSize: 17,
    marginBottom: 10,
  },
  btnView: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonStyle: {},
  btnTextStyles: {},
  voiceButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  errorText: {
    color: "red",
    marginLeft: 10,
  },
});
