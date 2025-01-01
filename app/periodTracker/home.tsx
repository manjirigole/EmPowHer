import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import CircularProgress, {CircularProgressWithChild, CircularProgressBase} from 'react-native-circular-progress-indicator'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import { icons } from '@/constants';
import { Fonts } from '@/constants/fonts'
import { router } from 'expo-router'
import horizontalCalendar from './horizontalCalendar'
const home = () => {

  const props = {
    activeStrokeWidth: 25,
    inActiveStrokeWidth: 25,
    inActiveStrokeOpacity: 0.2
  }; 

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View >
          <View style={styles.icongrp}>
            <TouchableOpacity onPress={() => router.push('/periodTracker/calendar')}>
              <Image source={icons.calendar} style={styles.calendar}/>
            </TouchableOpacity>
            <Text style={styles.logo}>EmPowHer</Text>
            <TouchableOpacity>
              <Image source={icons.usericon} style={styles.usericon}/>
            </TouchableOpacity>
          </View>
        <Text>home</Text>
        </View>
        <View style={styles.card}>
          <Text>Card</Text>
        </View>
        <CircularProgress 
        value={20}
        radius={120}
        progressValueColor={'#fff'}
        duration={10000}
        strokeColorConfig={[
          {color: 'red', value: 0},
          {color: 'skyblue', value:50},
          {color: 'yellowgreen', value:100},
        ]}
        />
        <View></View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default home

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: Colors.primary,
    padding: 20,
  },
  icongrp:{
    flexDirection: "row",
    justifyContent: "space-between",
  },
  calendar:{
    height: 25,
    width: 25,
  },
  logo:{
    color: Colors.primary_pink800,
    fontFamily: Fonts.cbold,
    fontSize: 25,
    textAlign: "center",
    alignSelf:"center",
  },
  usericon:{
    height: 25,
    width: 25,
  },
  card:{
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.pink[300],
  },
})