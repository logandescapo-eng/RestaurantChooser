import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DecisionScreen({ navigation }) {
  const handleStart = async () => {
    const people = await AsyncStorage.getItem("people");
    const restaurants = await AsyncStorage.getItem("restaurants");

    if (!people || JSON.parse(people).length === 0) {
      Alert.alert(
        "That ain't gonna work, chief",
        "You need to add some people first before making a decision.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!restaurants || JSON.parse(restaurants).length === 0) {
      Alert.alert(
        "That ain't gonna work, chief",
        "You need to add some restaurants first before making a decision.",
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate("WhosGoing");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>It's Decision Time!</Text>
      <TouchableOpacity onPress={handleStart} style={styles.imageContainer}>
        <Image
          source={require("../../assets/decisionTime.jpg")}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.subtext}>Tap the image to get started</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  headline: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  subtext: {
    marginTop: 30,
    fontSize: 16,
    color: "#888",
  },
});