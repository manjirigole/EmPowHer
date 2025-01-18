import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import diary from './diary'
const Stack = createNativeStackNavigator();
const AuthLayout = () => {
  return (
      <Stack.Navigator>
      <Stack.Screen 
      name="sign-in" 
      options={{headerShown: false}}
      component={diary}
      />
    </Stack.Navigator>
  )
}

export default AuthLayout