import React from "react";
import { Stack } from "expo-router";

const SymptomsLaout = () => {
  return (
    <Stack>
      <Stack.Screen name="symptoms" options={{ headerShown: false }} />
    </Stack>
  );
};

export default SymptomsLaout;
