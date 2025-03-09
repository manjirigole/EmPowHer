import { StyleSheet, Text, View, FlatList } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { db } from "@/api/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MarkedDates } from "react-native-calendars/src/types";

LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
  today: "Today",
};
LocaleConfig.defaultLocale = "en";

interface Entry {
  id: string;
  text: string;
  date: string;
}

const Jump = () => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDateEntries, setSelectedDateEntries] = useState<Entry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchDiaryDates();
  }, [user]);

  const fetchDiaryDates = async () => {
    if (!user) return;

    const q = query(
      collection(db, "diaryEntries"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const dates: MarkedDates = {};

    querySnapshot.forEach((doc) => {
      const date = doc.data().date;
      if (date && date instanceof Timestamp) {
        const dateString = date.toDate().toISOString().split("T")[0];
        console.log("Marking Date:", dateString);
        dates[dateString] = { marked: true, dotColor: Colors.primary };
      }
    });
    console.log("Marked Dates:", dates);
    setMarkedDates(dates);
  };

  const onDayPress = async (day: DateData) => {
    const selectedDate = day.dateString;
    if (!user) return;

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "diaryEntries"),
      where("userId", "==", user.uid),
      where("date", ">=", Timestamp.fromDate(startOfDay)),
      where("date", "<=", Timestamp.fromDate(endOfDay))
    );
    const querySnapshot = await getDocs(q);
    const entries: Entry[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      text: doc.data().text,
      date: doc.data().date.toDate().toLocaleDateString(),
    }));
    setSelectedDateEntries(entries);
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView>
          <Calendar
            markedDates={markedDates}
            onDayPress={onDayPress}
            style={styles.calendar}
            theme={calendarTheme}
          />
          <FlatList
            data={selectedDateEntries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.entry}>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Jump;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    padding: 20,
  },
  calendar: {
    paddingBottom: 20,
    backgroundColor: Colors.primary_pink800,
    borderRadius: 10,
  },
  entry: {
    backgroundColor: Colors.pink[300],
  },
  text: {
    color: Colors.primary_pink800,
    fontFamily: Fonts.cbold,
  },
});

const calendarTheme = {
  backgroundColor: Colors.primary_pink800,
  calendarBackground: Colors.primary_pink800,
  textSectionTitleColor: "white",
  selectedDayBackgroundColor: "white",
  selectedDayTextColor: Colors.secondary[200],
  todayTextColor: "white",
  dayTextColor: "white",
  textDisabledColor: "#d9e1e8",
  dotColor: Colors.primary,
  selectedDotColor: Colors.primary_pink800,
  arrowColor: "white",
  monthTextColor: "white",
  textDayFontFamily: Fonts.cmedium,
  textMonthFontFamily: Fonts.cbold,
  textDayHeaderFontFamily: Fonts.cmedium,
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
};
