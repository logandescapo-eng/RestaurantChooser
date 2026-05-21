import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/customButton";

export default function WhosGoingScreen({ navigation }) {
  const [people, setPeople] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const loadPeople = async () => {
      const data = await AsyncStorage.getItem("people");
      if (data) {
        const parsed = JSON.parse(data);
        setPeople(parsed);
        setSelected(new Array(parsed.length).fill(false));
      }
    };
    loadPeople();
  }, []);

  // Handle Android hardware back button
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Go back?", "Are you sure you want to go back to the start?", [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => navigation.goBack() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const toggleSelection = (index) => {
    const updatedSelected = [...selected];
    updatedSelected[index] = !updatedSelected[index];
    setSelected(updatedSelected);
  };

  const handleNext = () => {
    const selectedParticipants = people
      .map((person, index) =>
        selected[index] ? { ...person, vetoed: "no" } : null
      )
      .filter(Boolean);

    if (selectedParticipants.length === 0) {
      Alert.alert("No one selected", "Please select at least one person.");
      return;
    }

    navigation.navigate("PreFilters", { participants: selectedParticipants });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Who's Going?</Text>
      <FlatList
        data={people}
        keyExtractor={(item) => item.key}
        style={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.personRow}>
            <Checkbox
              value={selected[index] || false}
              onValueChange={() => toggleSelection(index)}
              color={selected[index] ? "#ff0000" : undefined}
            />
            <Text style={styles.personName}>
              {item.firstName} {item.lastName}
            </Text>
          </View>
        )}
      />
      <CustomButton
        text="Next"
        onPress={handleNext}
        width="94%"
        buttonStyle={styles.nextButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headline: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    width: "94%",
    flex: 1,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    gap: 14,
  },
  personName: {
    fontSize: 18,
  },
  nextButton: {
    backgroundColor: "#007bff",
    marginTop: 10,
  },
});