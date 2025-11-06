import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ApiScreen from "./screens/ApiScreen";
import HomeScreen from "./screens/HomeScreen";
import OutstreamPlayer from "./screens/OutstreamPlayerScreen";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Home",
  screenOptions: {
    headerStyle: { backgroundColor: "blue" },
    headerTintColor: "#fff",
  },
  screens: {
    Home: { screen: HomeScreen, options: { title: "React Native SDK" } },
    OutstreamPlayer: OutstreamPlayer,
    Api: ApiScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={"blue"} />
      <Navigation />
    </SafeAreaProvider>
  );
}
