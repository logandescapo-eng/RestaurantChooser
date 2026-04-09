import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import PeopleScreen from "../screens/people/peopleScreen";
import DecisionScreen from "../screens/decision/decisionScreen";
import RestaurantsScreen from "../screens/restaurants/restaurantsScreen";
import { Image, Platform } from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import peopleIcon from "../assets/people.jpg";
import decisionIcon from "../assets/decision.jpg";
import restaurantIcon from "../assets/restaurant.jpg";

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
          tabBarShowIcons: true,
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
            tabBarIcon: () => (
              <Image
                source={peopleIcon}
                style={{ width: 32, height: 32, resizeMode: "contain" }}
              />
            ),
          }}
          component={PeopleScreen}
        />
        <Tab.Screen
          name="Decision"
          options={{
            tabBarIcon: () => (
              <Image
                source={decisionIcon}
                style={{ width: 32, height: 32, resizeMode: "contain" }}
              />
            ),
          }}
          component={DecisionScreen}
        />
        <Tab.Screen
          name="Restaurants"
          options={{
            tabBarIcon: () => (
              <Image
                source={restaurantIcon}
                style={{ width: 32, height: 32, resizeMode: "contain" }}
              />
            ),
          }}
          component={RestaurantsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}