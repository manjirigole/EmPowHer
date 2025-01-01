import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { images } from '@/constants'
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/fonts';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'expo-router';
const ConfirmationStep = () => {
  const router = useRouter();
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.heading}>Congratulations! Tracking Intiated</Text>
          <Image 
          source={images.confirm}
          style={styles.confirmImg}
          />
          <Text style={styles.confirmDesc}>You're now all set to track your cycle, symptoms, and wellness with ease. Stay informed and empowered every step of the way!</Text>
          <View style={styles.confirmBtn}>
            <CustomButton 
            title="Start Tracking"
            handlePress={() => router.push('/periodTracker/home')}
            />
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default ConfirmationStep

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  heading:{
    fontFamily: Fonts.cbold,
    color: Colors.primary_text.brown,
    fontSize: 20,
    paddingBottom: 5,
    textAlign: "center",
  },
  confirmImg:{
    width: 300,
    height: 300,
    alignSelf: "center",
  },
  confirmDesc:{
    padding: 45,
    textAlign: "center",
  },
  confirmBtn:{
    alignItems: "center",
  },
})