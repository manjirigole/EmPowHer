// sign-in.tsx

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/fonts';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CustomTextInput from '@/components/CustomTextInput';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseauth, doc, getDoc, db } from '@/api/firebase'; // Adjust the import path as needed

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // Handle user state changes
  function handleAuthStateChanged(user: User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(firebaseauth, handleAuthStateChanged);
    return () => subscriber(); // Unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    try{
      const userCredential = await signInWithEmailAndPassword(firebaseauth, email, password);
      const user = userCredential.user;

      //check if the user exists in firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()){
        console.error('No such user found in firestore!');
        //handle case where user does not exists in firestore
        //you can choose to redirect to registration or show an error message
        return;
      }

      router.push('/periodTracker/home');
    } catch (error) {
      console.error(error);
      //handle login errors here
    }
  };

  if (!user) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <View>
              <Text style={styles.logo}>EmPowHer</Text>
              <Text style={styles.login}>Log In</Text>
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <CustomTextInput
                value={email}
                placeholder="XYZ@gmail.com"
                handleChangeText={setEmail}
              />
            </View>
            <View style={styles.passwordContainer}>
              <Text style={styles.label}>Password</Text>
              <CustomTextInput
                value={password}
                placeholder=""
                handleChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={23}
                  color={Colors.primary_pink800}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.forgotP}>
              <Text style={{ textAlign: "right" }}>Forgot Password</Text>
            </View>
            <View style={styles.loginbtn}>
              <CustomButton
                title="Log In"
                handlePress={handleLogin}
              />
            </View>
            <View style={styles.signupview}>
              <Text style={{ textAlign: "center" }}>Don't have an Account?</Text>
              <Text style={styles.signuplink} onPress={() => router.push('/sign-up')}>Sign Up</Text>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
  return (
    <View style={styles.containersignin}>
      <Text style={styles.welcometext}>Welcome back!!</Text>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    flex: 1,
    padding: 15,
    justifyContent: "center"
  },
  label: {
    fontWeight: '600',
    color: Colors.primary_text.brown,
    fontSize: 17,
    marginLeft: 15,
  },
  logo: {
    color: Colors.primary_pink800,
    fontFamily: Fonts.cextrabold,
    fontSize: 34,
    marginBottom: 10,
    paddingLeft: 15,
  },
  login: {
    fontSize: 25,
    padding: 15,
    paddingBottom: 25,
    fontWeight: '600',
    color: Colors.primary_text.brown
  },
  forgotP: {
    color: Colors.primary_text.brown,
    marginRight: 20,
  },
  passwordContainer: {
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginRight: 20,
  },
  loginbtn: {
    margin: 15,
  },
  signupview: {
    flexDirection: "row",
    alignSelf: "center",
  },
  signuplink: {
    color: Colors.primary_pink800,
    fontWeight: '600',
    marginLeft: 5,
  },
  containersignin:{
    backgroundColor: Colors.primary,
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"  ,
  },
  welcometext:{
    color: Colors.primary_pink800,
    fontFamily: Fonts.cbold,
    fontSize: 25,
  },
});