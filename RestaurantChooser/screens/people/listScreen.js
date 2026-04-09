import React, { useState, useEffect } from "react";
import { View, FlatList, Alert, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/customButton";
import Toast from "react-native-toast-message";

const ListScreen = ({ navigation }) => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchPeople);
    return unsubscribe;
  }, [navigation]);

  const fetchPeople = async () => {
    try {
      const data = await AsyncStorage.getItem("people");
      if (data) setPeople(JSON.parse(data));
      else setPeople([]);
    } catch (error) {
      console.error("Failed to load people:", error);
    }
  };

  const deletePerson = async (id) => {
    Alert.alert("Delete Person", "Are you sure you want to delete this person?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          const updated = people.filter((p) => p.key !== id);
          await AsyncStorage.setItem("people", JSON.stringify(updated));
          setPeople(updated);
          Toast.show({
            type: "error",
            position: "bottom",
            visibilityTime: 2000,
            text1: "Person deleted",
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomButton
        text="Add Person"
        onPress={() => navigation.navigate("PeopleAdd")}
        buttonStyle={styles.addButton}
      />
      {people.length === 0 ? (
        <Text style={styles.emptyText}>No people yet. Add someone!</Text>
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.personItem}>
              <Text style={styles.text}>
                {item.firstName} {item.lastName}
              </Text>
              <CustomButton
                text="Delete"
                onPress={() => deletePerson(item.key)}
                buttonStyle={styles.deleteButton}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007bff",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 16,
  },
  personItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 18,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "red",
  },
});

export default ListScreen;