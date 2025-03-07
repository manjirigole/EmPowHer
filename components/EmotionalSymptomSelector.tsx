import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Chip, Text, Button } from "react-native-paper";
import { auth, db } from "../api/firebase";
import { collection, addDoc } from "firebase/firestore";

const emotionalSymptoms = [
  "Mood Swings",
  "Irritability",
  "Anxiety",
  "Sadness",
  "Depression",
  "Restlessness",
  "Feeling Overwhelmed",
];

const EmotionalSymptomSelector: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms((prev) => prev.filter((item) => item !== symptom));
    } else {
      setSelectedSymptoms((prev) => [...prev, symptom]);
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      const userId = auth.currentUser.uid;

      // Change doc to collection to allow multiple entries
      const userSymptomsCollection = collection(
        db,
        "users",
        userId,
        "symptoms",
        "emotional",
        "entries"
      );

      await addDoc(userSymptomsCollection, {
        type: "emotional",
        symptoms: selectedSymptoms,
        timestamp: new Date(),
      });

      Alert.alert("Success", "Emotional symptoms logged successfully!");
      setSelectedSymptoms([]);
    } catch (error) {
      console.error("Error logging symptoms: ", error);
      Alert.alert("Error", "Failed to log emotional symptoms");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Emotional Symptoms
        </Text>
      </View>
      <View style={styles.chipContainer}>
        {emotionalSymptoms.map((symptom) => (
          <Chip
            key={symptom}
            mode="outlined"
            selected={selectedSymptoms.includes(symptom)}
            onPress={() => toggleSymptom(symptom)}
            style={[
              styles.chip,
              selectedSymptoms.includes(symptom) && styles.chipSelected,
            ]}
            textStyle={styles.chipText}
            selectedColor="#830047"
          >
            {symptom}
          </Chip>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        labelStyle={{ color: "#830047" }}
      >
        Log Emotional Symptoms
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#84063a",
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  titleContainer: {
    backgroundColor: "#84063a",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  title: {
    color: "#fdd1df",
    textAlign: "center",
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    margin: 4,
    backgroundColor: "#fbd1df",
  },
  chipSelected: {
    borderColor: "#830047",
    borderWidth: 1.5,
  },
  chipText: {
    color: "#830047",
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#fdd1df",
  },
});

export default EmotionalSymptomSelector;
