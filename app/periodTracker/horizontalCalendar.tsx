import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReactHorizontalDatePicker from "react-horizontal-strip-datepicker";
import "react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css";

const horizontalCalendar = () => {
  const onSelectedDay = (d) => {
    console.log(d);
  };
  return (
    <View>
      <Text>horizontalCalendar</Text>
      <ReactHorizontalDatePicker 
      selectedDay = {onSelectedDay}
      enableScroll={true}
      enableDays={15}
      color={"#300000"}
      />
    </View>
  )
}

export default horizontalCalendar

const styles = StyleSheet.create({})