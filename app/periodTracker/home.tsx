import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { useRouter, useSearchParams } from "expo-router/build/hooks";
import CustomBottomBar from "@/components/CustomBottomBar";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import CurrentDate from "@/components/CurrentDate";
import HorizontalCalendar from "@/components/HorizontalCalendar";
import { Ionicons } from "@expo/vector-icons";
import CircularTracker from "@/components/CircularTracker";
import Blogs from "../blogs/blogs";
import CustomButton from "@/components/CustomButton";

type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Diary: undefined;
};

type HomeScreenProps = {
  navigation: BottomTabNavigationProp<RootTabParamList, "Home">;
};

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("initial") || "";

  const handleSymptoms = () => {
    router.push("/symptomsTracker/symptoms");
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.container2}>
          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons
              name="calendar-outline"
              color={Colors.primary_pink800}
              size={24}
              onPress={() => router.push("/periodTracker/calendar")}
            />
          </TouchableOpacity>
          <Text style={styles.logo}>EmPowHer</Text>
          <View style={styles.spacer} />
        </View>

        {/* Current Date */}
        <View>
          <CurrentDate />
        </View>

        {/* Horizontal Calendar */}
        <View>
          <HorizontalCalendar />
        </View>

        {/* Circular Tracker */}
        <View style={styles.card}>
          <CircularTracker />
        </View>

        {/* Log Period Button */}
        <View style={styles.logPeriodContainer}>
          <TouchableOpacity style={styles.logPeriodBtn}>
            <Ionicons
              name="add-circle-outline"
              color={Colors.primary_pink800}
              size={20}
            />
            <Text style={styles.logPeriodText}>Log Period</Text>
          </TouchableOpacity>
        </View>
        {/* Symptoms Tracker */}
        <View style={styles.symptomsContainer}>
          <CustomButton
            title="Symptom Trackers"
            handlePress={handleSymptoms}
            style={styles.symptoms}
          ></CustomButton>
        </View>
        {/* Blog Cards */}
        <View style={{ flex: 1, paddingTop: 0 }}>
          <Blogs />
        </View>
      </ScrollView>

      {/* Custom Bottom Bar */}
      <CustomBottomBar />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80, // To avoid overlapping with the bottom bar
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconContainer: {
    flex: 1,
  },
  logo: {
    flex: 2,
    color: Colors.primary_pink800,
    fontFamily: Fonts.cbold,
    fontSize: 25,
    textAlign: "center",
  },
  spacer: {
    flex: 1,
  },
  card: {
    alignContent: "center",
    justifyContent: "center",
  },
  logPeriodContainer: {
    alignItems: "center",
    padding: 20,
  },
  logPeriodBtn: {
    flexDirection: "row",
    width: 150,
    height: 50,
    backgroundColor: Colors.pink[300],
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logPeriodText: {
    color: Colors.primary_text.brown,
    fontSize: 20,
    fontFamily: Fonts.cbold,
  },
  symptoms: {
    justifyContent: "center",
  },
  symptomsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
