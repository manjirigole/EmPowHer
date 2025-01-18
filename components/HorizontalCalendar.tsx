import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
interface DateItem {
  id: number;
  date: string;
  day: number;
  dayOfWeek: string;
}

const HorizontalCalendar: React.FC = () => {
  // Generate a sample array of dates for the calendar
  const today = new Date();
  const startOfWeek = new Date(today);
  const dates: DateItem[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(today.getDate() + i);
    return {
      id: i,
      date: date.toDateString(),
      day: date.getDate(),
      dayOfWeek: date.toLocaleString("default", { weekday: "short" }),
    };
  });

  // State for selected date, allowing both null and string
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toDateString()
  );

  const handleDatePress = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dates}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.calendar}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateContainer,
              selectedDate === item.date && styles.selectedDateContainer,
            ]}
            onPress={() => handleDatePress(item.date)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate === item.date && styles.selectedDateText,
              ]}
            >
              {item.day}
            </Text>
            <Text
              style={[
                styles.dayOfWeekText,
                selectedDate === item.date && styles.selectedDateText,
              ]}
            >
              {item.dayOfWeek}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center", // Center horizontally
  },
  calendar: {
    padding: 10,
  },
  dateContainer: {
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 15,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  selectedDateContainer: {
    backgroundColor: Colors.primary_pink800,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  dayOfWeekText: {
    fontSize: 12,
    color: "#666",
  },
  selectedDateText: {
    color: Colors.primary,
    fontWeight: "600", // Fixed fontWeight value
  },
});

export default HorizontalCalendar;
