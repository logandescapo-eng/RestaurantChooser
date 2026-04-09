import React, { useState, useEffect } from "react";
import { View, FlatList, Alert, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/customButton";
import Toast from "react-native-toast-message";

const ListScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchRestaurants);
    return unsubscribe;
  }, [navigation]);

  const fetchRestaurants = async () => {
    try {
      const data = await AsyncStorage.getItem("restaurants");
      if (data) setRestaurants(JSON.parse(data));
      else setRestaurants([]);
    } catch (error) {
      console.error("Failed to load restaurants:", error);
    }
  };

  const deleteRestaurant = async (id) => {
    Alert.alert("Delete Restaurant", "Are you sure you want to delete this restaurant?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          const updated = restaurants.filter((r) => r.key !== id);
          await AsyncStorage.setItem("restaurants", JSON.stringify(updated));
          setRestaurants(updated);
          Toast.show({
            type: "error",
            position: "bottom",
            visibilityTime: 2000,
            text1: "Restaurant deleted",
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <CustomButton
        text="Add Restaurant"
        onPress={() => navigation.navigate("RestaurantsAdd")}
        buttonStyle={styles.addButton}
      />
      {restaurants.length === 0 ? (
        <Text style={styles.emptyText}>No restaurants yet. Add one!</Text>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.restaurantItem}>
              <Text style={styles.text}>{item.name}</Text>
              <CustomButton
                text="Delete"
                onPress={() => deleteRestaurant(item.key)}
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
  restaurantItem: {
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