import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import PeopleScreen from "../screens/people/peopleScreen";
import DecisionScreenNavigation from "../screens/decision/decisionScreenNavigation";
import RestaurantsScreen from "../screens/restaurants/restaurantsScreen";
import { Image, Platform } from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

const platformOS = Platform.OS.toLowerCase();
const Tab = createMaterialTopTabNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        initialRouteName="Restaurants"
        tabBarPosition={platformOS === "ios" ? "bottom" : "top"}
        screenOptions={{
          animationEnabled: true,
          swipeEnabled: true,
          lazy: true,
          tabBarShowIcon: true,
          tabBarIndicatorStyle: { backgroundColor: "#555555" },
          tabBarActiveTintColor: "#ff0000",
          tabBarStyle: {
            paddingTop: platformOS === "android" ? Constants.statusBarHeight : 0,
          },
        }}
      >
        <Tab.Screen
          name="People"
          options={{
            tabBarIcon: ({ color }) => (
              <Image
                source={require("../assets/people.jpg")}
                style={{ width: 32, height: 32 }}
              />
            ),
          }}
          component={PeopleScreen}
        />
        <Tab.Screen
          name="Decision"
          options={{
            tabBarIcon: ({ color }) => (
              <Image
                source={require("../assets/decision.jpg")}
                style={{ width: 32, height: 32 }}
              />
            ),
          }}
          component={DecisionScreenNavigation}
        />
        <Tab.Screen
          name="Restaurants"
          options={{
            tabBarIcon: ({ color }) => (
              <Image
                source={require("../assets/restaurant.jpg")}
                style={{ width: 32, height: 32 }}
              />
            ),
          }}
          component={RestaurantsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}