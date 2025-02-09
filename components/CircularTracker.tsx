import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { fetchPeriodData } from "../api/firebase";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/fonts";
import moment from "moment";
import { Timestamp } from "firebase/firestore";
import HorizontalCalendar from "./HorizontalCalendar";

interface PeriodDay {
  date: Timestamp;
  day: number;
}
interface PeriodData {
  period_days: PeriodDay[];
  ovulation_date: Timestamp;
}
interface CircularTrackerProps {
  userId: string;
  onHighlightDays: (days: Date[]) => void;
}
const CircularTracker = ({ userId, onHighlightDays }: CircularTrackerProps) => {
  const [periodDays, setPeriodDays] = useState<PeriodDay[]>([]);
  const [ovulationDate, setOvulationDate] = useState<string | null>(null);
  const [todayPeriodDay, setTodayPeriodDay] = useState<PeriodDay | null>(null); // State for today's period day

  useEffect(() => {
    const getPeriodData = async () => {
      try {
        const periodData: PeriodData | null = await fetchPeriodData(userId);

        if (periodData && periodData.period_days && periodData.ovulation_date) {
          const today = new Date();
          const currentPeriodDays = periodData.period_days.filter((dayData) => {
            const periodDate = dayData.date.toDate();
            return (
              moment(periodDate).isSame(moment(today), "day") ||
              periodDate >= today
            );
          });

          setPeriodDays(currentPeriodDays);

          const todayPeriod = currentPeriodDays.find((dayData) => {
            const periodDate = dayData.date.toDate();
            return moment(periodDate).isSame(moment(today), "day");
          });

          setTodayPeriodDay(todayPeriod || null);
          setOvulationDate(
            moment(periodData.ovulation_date.toDate()).format("DD MMMM, YYYY")
          );

          const highlightedDates = currentPeriodDays.map((day) =>
            day.date.toDate()
          );
          onHighlightDays(highlightedDates);
        } else {
          setPeriodDays([]);
          setOvulationDate(null);
          setTodayPeriodDay(null);
        }
      } catch (error) {
        console.error("Error fetching or processing period data:", error);
        setPeriodDays([]);
        setOvulationDate(null);
        setTodayPeriodDay(null);
      }
    };

    getPeriodData();
  }, [userId, onHighlightDays]);

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100">
          <Circle
            cx={50}
            cy={50}
            r={50}
            stroke={Colors.pink[300]}
            strokeWidth={0.5}
            fill={Colors.menstrualColor}
            strokeOpacity={0.8}
          />
        </Svg>

        {/* Center content in a column */}
        <View style={styles.centerTextWrapper}>
          {ovulationDate && (
            <View style={styles.ovulationDateContainer}>
              <Text style={styles.ovulationDateText}>
                Ovulation: {ovulationDate}
              </Text>
            </View>
          )}
        </View>
      </View>

      {periodDays.map((dayData, index) => {
        //const periodDate = new Date(dayData.date.seconds * 1000);
        const periodDate = dayData.date.toDate();
        const isToday = moment(new Date()).isSame(moment(periodDate), "day");

        const angle = (index / periodDays.length) * 360;
        const x = 50 + 40 * Math.cos(((angle - 90) * Math.PI) / 180);
        const y = 50 + 40 * Math.sin(((angle - 90) * Math.PI) / 180);

        return (
          isToday && (
            <View key={index} style={[styles.dayWrapper, { left: x, top: y }]}>
              <Text
                style={[
                  styles.dayText,
                  {
                    color: isToday ? Colors.primary_text.brown : "black",
                  },
                ]}
              >
                {isToday
                  ? `Day ${todayPeriodDay?.day ?? ""} of period`
                  : `Day ${dayData.day}`}
              </Text>
            </View>
          )
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circleContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Add position relative for stacking
  },
  centerTextWrapper: {
    position: "absolute",
    top: "70%",
    left: "37%",
    transform: [{ translateX: -50 }, { translateY: -50 }], // Center text perfectly
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column", // Stack the text vertically
  },
  dayText: {
    fontSize: 20,
    fontFamily: Fonts.cbold,
    textAlign: "center",
    color: Colors.primary_text.brown,
    alignContent: "center",
    top: "400%",
    left: "50%",
  },
  ovulationDateContainer: {
    marginTop: 5, // Add margin to separate it from the day text
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 5,
  },
  ovulationDateText: {
    fontSize: 14,
    fontFamily: Fonts.cmedium,
    color: Colors.primary_pink800,
  },
  dayWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CircularTracker;
