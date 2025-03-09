import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/fonts";
import { useRouter } from "expo-router";
import CustomSymptomSelector from "@/components/CustomSymptomSelector";
import { firebaseauth, logSymptoms } from "@/api/firebase";

const Symptoms = () => {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState({
    physical: [],
    behavioral: [],
    emotional: [],
  });
  const user = firebaseauth.currentUser;
  const userId = user?.uid;

  const handleSymptomSelect = (
    type: "physical" | "behavioral" | "emotional",
    symptoms: string[]
  ) => {
    console.log(`${type} Symptoms Selected:`, symptoms);

    setSelectedSymptoms((prev) => ({
      ...prev,
      [type]: symptoms,
    }));
  };

  const handleSaveSymptoms = async () => {
    if (!userId) {
      console.log("User not authenticated");
      return;
    }

    try {
      for (const category of ["physical", "behavioral", "emotional"] as const) {
        if (selectedSymptoms[category].length > 0) {
          await logSymptoms(category, selectedSymptoms[category]);
        }
      }
      console.log("Symptoms saved successfully");
    } catch (error) {
      console.error("Error saving symptoms:", error);
    }
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.header}>
              <Ionicons
                name="chevron-back-outline"
                style={styles.backIcon}
                onPress={() => router.push("/periodTracker/home")}
              />
              <Text style={styles.symptoms}>Symptoms Tracker</Text>
            </View>
            <CustomSymptomSelector
              title="Physical"
              symptomType="physical"
              symptomsList={[
                "Fatigue",
                "Headaches",
                "Bloating",
                "Cramps",
                "Acne",
                "Back Pain",
                "Nausea",
                "Breast Tenderness",
              ]}
              onSelect={(symptoms) => handleSymptomSelect("physical", symptoms)}
            />
            <CustomSymptomSelector
              title="Behavioral"
              symptomType="behavioral"
              symptomsList={[
                "Energetic",
                "Low Energy",
                "Self Critical",
                "Productivity",
                "Exercise",
              ]}
              onSelect={(symptoms) =>
                handleSymptomSelect("behavioral", symptoms)
              }
            />
            <CustomSymptomSelector
              title="Emotional"
              symptomType="emotional"
              symptomsList={[
                "Mood Swings",
                "Irritability",
                "Anxiety",
                "Sadness",
                "Depression",
                "Restlessness",
                "Overwhelmed",
              ]}
              onSelect={(symptoms) =>
                handleSymptomSelect("emotional", symptoms)
              }
            />
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Symptoms;

const styles = StyleSheet.create({
  scrollContainer: { padding: 15 },
  container: { backgroundColor: Colors.primary },
  header: { display: "flex", flexDirection: "row", paddingLeft: 10, gap: 10 },
  backIcon: { fontSize: 25, color: Colors.primary_pink800, padding: 10 },
  symptoms: {
    padding: 10,
    paddingLeft: 4,
    color: Colors.primary_text.brown,
    fontSize: 20,
    fontFamily: Fonts.cbold,
  },
});
