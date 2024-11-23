import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { images } from "../../constants";
import { CustomButton } from "../../components";
import * as Notifications from "expo-notifications";

const Notification = () => {
  const handlePress = async () => {
    const token = await registerForPushNotificationsAsync(); //get the token
    if (token) {
      await sendPushNotification(token);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    // Request permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    // Stop here if the user did not grant the permissions
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Get the token for the device
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Send notifications
  const sendPushNotification = async (token) => {
    const message = {
      to: token,
      sound: "default",
      title: "Reminder",
      body: "This is a reminder to manage your health!",
      data: { someData: "goes here" },
    };
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View style={styles.container}>
        <Link href="confirm">
          <Text style={styles.skipText} className="font-psemibold">
            Skip
          </Text>
        </Link>
        <View className="justify-center items-center mt-20">
          <Image source={images.notify} className="w-[300px] h-[350px] mb-4" />
          <Text
            className="text-primary_text-brown font-imedium18 w-42"
            style={styles.message}
          >
            {"\n   "}Unable to receive notifications? Turn on{"\n     "}
            notifications to stay updated on your{"\n"}personalized reminders to
            help you manage
            {"\n               "}
            your health effortlessly!
          </Text>
          <CustomButton
            title="Turn On Notification"
            handlePress={handlePress}
            containerStyles={styles.notifybtn}
            className="justify-start"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: "flex-end", // Align content to the right
    padding: 20, // Optional padding
  },
  skipText: {
    color: "#84063A", // Replace with your desired color
    fontSize: 18, // Adjust size as needed
  },
  notifybtn: {
    width: 300,
    alignItems: "center",
  },
  message: {
    fontSize: 16,
  },
};

export default Notification;
