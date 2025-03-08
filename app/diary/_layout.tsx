import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import diary from "./diary";
const Stack = createNativeStackNavigator();
const DiaryLayout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="diary"
        options={{ headerShown: false }}
        component={diary}
      />
    </Stack.Navigator>
  );
};

export default DiaryLayout;
