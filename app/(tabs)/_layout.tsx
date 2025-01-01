import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <>
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "white",
      tabBarInactiveBackgroundColor: "blue",
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: "pink",
        borderTopWidth: 1,
        borderTopColor: "green",
        height: 84,
      },
    }}
    />
    <Tabs.Screen
    name="index"
    options={{
      title: "Home",
      headerShown: false,
    }}
    ></Tabs.Screen>
    <Tabs.Screen
    name="bookmark"
    options={{
      title: "Bookmark",
      headerShown: false,
    }}
    ></Tabs.Screen>
    <Tabs.Screen
    name="profile"
    options={{
      title: "profile",
      headerShown: false,
    }}
    ></Tabs.Screen>
    </>
  )
}

export default _layout

const styles = StyleSheet.create({})