import { useEffect } from "react";
import { useFonts } from "expo-font";
import "react-native-url-polyfill/auto";
import { SplashScreen, Stack } from "expo-router";
import GlobalProvider from "../context/GlobalProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),

    "CrimsonPro-ExtraBold": require("../assets/fonts/Crimson_Pro/static/CrimsonPro-Black.ttf"),
    "CrimsonPro-Bold": require("../assets/fonts/Crimson_Pro/static/CrimsonPro-Bold.ttf"),
    "CrimsonPro-SemiBold": require("../assets/fonts/Crimson_Pro/static/CrimsonPro-SemiBold.ttf"),
    "CrimsonPro-Medium": require("../assets/fonts/Crimson_Pro/static/CrimsonPro-SemiBold.ttf"),
    "CrimsonPro-Regular": require("../assets/fonts/Crimson_Pro/static/CrimsonPro-Regular.ttf"),
    "CrimsonPro-Black": require("../assets/fonts/Crimson_Pro/static/CrimsonPro-Black.ttf"),
    "CrimsonPro-ExtraLight": require("../assets/fonts/Crimson_Pro/static/CrimsonPro-ExtraLight.ttf"),
    "CrimsonPro-Light": require("../assets/fonts/Crimson_Pro/static/CrimsonPro-Light.ttf"),

    "Inter_18pt-ExtraBold": require("../assets/fonts/Inter/static/Inter_18pt-ExtraBold.ttf"),
    "Inter_18pt-Bold": require("../assets/fonts/Inter/static/Inter_18pt-Bold.ttf"),
    "Inter_18pt-SemiBold": require("../assets/fonts/Inter/static/Inter_18pt-SemiBold.ttf"),
    "Inter_18pt-Medium": require("../assets/fonts/Inter/static/Inter_18pt-Medium.ttf"),
    "Inter_18pt-Regular": require("../assets/fonts/Inter/static/Inter_18pt-Regular.ttf"),

    "Inter_24pt-ExtraBold": require("../assets/fonts/Inter/static/Inter_24pt-ExtraBold.ttf"),
    "Inter_24pt-Bold": require("../assets/fonts/Inter/static/Inter_24pt-Bold.ttf"),
    "Inter_24pt-SemiBold": require("../assets/fonts/Inter/static/Inter_24pt-SemiBold.ttf"),
    "Inter_24pt-Medium": require("../assets/fonts/Inter/static/Inter_24pt-Medium.ttf"),
    "Inter_24pt-Regular": require("../assets/fonts/Inter/static/Inter_18pt-Regular.ttf"),

    "Inter_28pt-ExtraBold": require("../assets/fonts/Inter/static/Inter_28pt-ExtraBold.ttf"),
    "Inter_28pt-Bold": require("../assets/fonts/Inter/static/Inter_28pt-Bold.ttf"),
    "Inter_28pt-SemiBold": require("../assets/fonts/Inter/static/Inter_28pt-SemiBold.ttf"),
    "Inter_28pt-Medium": require("../assets/fonts/Inter/static/Inter_28pt-Medium.ttf"),
    "Inter_28pt-Regular": require("../assets/fonts/Inter/static/Inter_28pt-Regular.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      return;
    }

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);
  //display a loading screen if fonts not loaded
  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
