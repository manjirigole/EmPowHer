import { StatusBar } from "expo-status-bar";
import { useEffect } from "react"; // Import useEffect
import { router } from "expo-router"; // Import router from expo-router
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  useEffect(() => {
    if (!loading) {
      if (isLogged) {
        // Navigate to home if logged in
        router.push("home");
      } else {
        // Optionally, navigate to the login or signup screen if not logged in
        router.push("/sign-in"); // Change this as needed
      }
    }
  }, [loading, isLogged]);

  // Show loader while loading
  if (loading) return <Loader isLoading={loading} />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.homescreen_lady}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-pink-600 font-cbold text-center leading-36px">
              Empowering women with{"\n"}
              <Text className="text-primary_pink800 text-4xl leading-36px">
                EmPowHer
              </Text>
            </Text>
          </View>

          <Text className="font-imedium18 text-pink-700 mt-7 text-center text-lg leading-22">
            Easily track your menstrual cycle, predict your next period, and
            stay informed about your body’s natural rhythms.
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")} // Change this as needed
            containerStyles="w-full mt-7 "
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};
export default Welcome;
