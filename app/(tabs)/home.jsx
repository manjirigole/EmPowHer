import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import FormField from "../../components/FormField";
import RadioButton from "../../components/RadioButton";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import Notification from "./Notification";
const Home = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState(false);

  const handleNextStep = (stepIndex) => {
    if (stepIndex === 0 && name.trim() === "") {
      Alert.alert("Error", "Please enter a valid name!");
      setErrors(true);
      setIsValid(false);
      return false;
    } else if (stepIndex === 1 && age.trim() === "") {
      Alert.alert("Error", "Please enter a valid age!");
      setErrors(true);
      setIsValid(false);
      return false;
    } else if (stepIndex === 2 && goal === "") {
      Alert.alert("Error", "Please select a goal!");
      setErrors(true);
      setIsValid(false);
      return false;
    } else if (stepIndex === 3 && selectedDate === "") {
      Alert.alert("Error", "Please select a date!");
      setErrors(true);
      setIsValid(false);
      return false;
    }
    if (stepIndex === 3) {
      console.log("notif"); // Navigate to the notification page
    }

    setErrors(false);
    setIsValid(true);
    return true;
  };

  const handleGoalSelection = (selectedGoal) => {
    setGoal(selectedGoal);
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex}>
        <ProgressSteps
          activeStepIconBorderColor="#DC3C68"
          progressBarColor="#DC3C68"
          completedProgressBarColor="#DC3C68"
          activeStepIconColor="#DC3C68"
          completedStepIconColor="#DC3C68"
          labelColor="#DC3C68"
          activeLabelColor="#DC3C68"
          completedLabelColor="#DC3C68"
          activeStepNumColor="white"
          completedStepNumColor="white"
        >
          <ProgressStep
            label="First Step"
            onNext={() => handleNextStep(0)}
            previousBtnText="Sign In"
            nextBtnTextStyle={{ color: "#DC3C68" }}
            previousBtnTextStyle={{ color: "#DC3C68" }}
            errors={errors}
          >
            <View style={styles.centerContainer}>
              <Text style={styles.questionText}>
                What would you like us to call you?
              </Text>
              <FormField
                placeholder="Enter your name"
                placeholderTextColor="#FBD1DF"
                value={name}
                handleChangeText={setName}
                style={styles.inputField}
              />
            </View>
          </ProgressStep>

          <ProgressStep
            label="Second Step"
            onNext={() => handleNextStep(1)}
            previousBtnTextStyle={{ color: "#DC3C68" }}
            nextBtnTextStyle={{ color: "#DC3C68" }}
            errors={errors}
          >
            <View style={styles.centerContainer}>
              <Text style={styles.questionText}>What is your age?</Text>
              <FormField
                placeholder="Enter your age"
                placeholderTextColor="#FBD1DF"
                value={age}
                handleChangeText={setAge}
                style={styles.inputField}
              />
            </View>
          </ProgressStep>

          <ProgressStep
            label="Third Step"
            onNext={() => handleNextStep(2)}
            finishBtnText="Submit"
            previousBtnTextStyle={{ color: "#DC3C68" }}
            nextBtnTextStyle={{ color: "#DC3C68" }}
            errors={errors}
          >
            <View style={styles.centerContainer}>
              <Text style={styles.questionText}>What is your goal?</Text>
              <RadioButton
                label="Period Tracker"
                selected={goal === "Period Tracker"}
                onPress={() => handleGoalSelection("Period Tracker")}
                style={styles.radioContainer}
              />
              <RadioButton
                label="Pregnancy Tracker"
                selected={goal === "Pregnancy Tracker"}
                onPress={() => handleGoalSelection("Pregnancy Tracker")}
              />
            </View>
          </ProgressStep>

          <ProgressStep
            label="Fourth Step"
            finishBtnText="Submit"
            previousBtnTextStyle={{ color: "#DC3C68" }}
            nextBtnTextStyle={{ color: "#DC3C68" }}
            errors={errors}
            onSubmit={() => {
              const isValidStep = handleNextStep(3);
              if (isValidStep) {
                console.log("notif");
                navigation.navigate("Notification");
              }
            }}
          >
            <View style={styles.centerContainer}>
              <Text style={styles.questionText}>Select a date:</Text>
              <Calendar
                onDayPress={onDayPress}
                markedDates={{
                  [selectedDate]: { selected: true, marked: true },
                }}
                theme={{
                  backgroundColor: "#FBD1DF",
                  calendarBackground: "#FBD1DF",
                  textSelectionTitleColor: "#300000",
                  selectedDayBackgroundColor: "#300000",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#DC3C68",
                  dayTextColor: "#DC3C68", // Change color of day text (includes weekdays)
                  monthTextColor: "#DC3C68", // Change color of month text
                  textDisabledColor: "#dc3c68", // Change color of disabled text
                  arrowColor: "#dc3c68",
                  fontFamily: "CrimsonPro-Bold",
                }}
                style={styles.calendar}
              />
              {selectedDate ? (
                <Text style={styles.selectedDateText}>
                  Selected Date: {selectedDate}
                </Text>
              ) : null}
            </View>
          </ProgressStep>
        </ProgressSteps>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EFDFFF",
    flex: 1,
  },
  flex: {
    flex: 1,
    marginTop: 10,
  },
  centerContainer: {
    flex: 1,
    marginLeft: 17,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
    backgroundColor: "#FBD1DF",
    padding: 20,
    borderRadius: 20,
    width: 350,
    fontFamily: "CrimsonPro-Bold",
  },
  questionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
    backgroundColor: "#830047",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "stretch",
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  calendar: {
    marginTop: 10,
    width: "100%", // Full width
    backgroundColor: "#FBD1DF",
    color: "#DC3C68",
  },
  selectedDateText: {
    marginTop: 10,
    color: "#DC3C68",
    fontSize: 18,
    fontFamily: "CrimsonPro-Bold",
  },
  selectedDate: {
    color: "#DC3C68",
  },
});

export default Home;
