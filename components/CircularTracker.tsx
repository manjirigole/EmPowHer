import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Svg, { Circle } from "react-native-svg";
import { Colors } from "@/constants/Colors";
const CircularTracker = () => {
  return (
    <View style={styles.container}>
      <Svg height={300} width={300} viewBox="0 0 100 100">
        <Circle
          cx={50}
          cy={50}
          r={50}
          stroke={Colors.pink[300]}
          strokeWidth={0.5}
          fill={Colors.menstrualColor}
          // opacity={0.6}
          strokeOpacity={0.8}
        />
      </Svg>
    </View>
  );
};

export default CircularTracker;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
