import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DecisionTimeScreen from "./decisionScreen";
import WhosGoingScreen from "./whosGoingScreen";
import PreFiltersScreen from "./preFiltersScreen";
import ChoiceScreen from "./choiceScreen";
import PostChoiceScreen from "./postChoiceScreen";

const Stack = createStackNavigator();

export default function DecisionScreenNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="DecisionTime"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="DecisionTime" component={DecisionTimeScreen} />
      <Stack.Screen name="WhosGoing" component={WhosGoingScreen} />
      <Stack.Screen name="PreFilters" component={PreFiltersScreen} />
      <Stack.Screen name="Choice" component={ChoiceScreen} />
      <Stack.Screen name="PostChoice" component={PostChoiceScreen} />
    </Stack.Navigator>
  );
}