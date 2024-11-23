import { StatusBar } from "expo-status-bar";
import { Redirect } from "expo-router"; // Remove Tabs import
import { View } from "react-native";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import Home from "../(tabs)/home"; // Adjust the import path accordingly
import Notification from "./Notification"; // Import Notification
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Correct import for stack navigator

const Stack = createNativeStackNavigator();

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  // Redirect to home if not logged in
  if (!loading && !isLogged) return <Redirect href="/home" />;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </View>
  );
};

export default TabLayout;
