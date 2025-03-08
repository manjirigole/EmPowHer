import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import CustomBottomBar from "@/components/CustomBottomBar";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/fonts";

const Diary = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Ionicons
              name="chevron-back-outline"
              style={styles.backIcon}
            ></Ionicons>
            <View>
              <Text style={styles.headerDiary}> My Diary</Text>
            </View>
          </View>
          <View style={styles.bottomNav}>
            <CustomBottomBar />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default Diary;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    padding: 10,
    flex: 1,
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingLeft: 20,
  },
  headerDiary: {
    fontSize: 20,
    color: Colors.primary_text.brown,
    fontFamily: Fonts.cbold,
  },
  backIcon: {
    color: Colors.primary_pink800,
    fontSize: 30,
  },
  bottomNav: {
    top: 100,
  },
});
