import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../../components/customButton";

export default function PostChoiceScreen({ navigation }) {
  const route = useRoute();
  const { chosenRestaurant } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headline}>Enjoy your meal!</Text>

      <View style={styles.detailsBox}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{chosenRestaurant.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Cuisine:</Text>
          <Text style={styles.value}>{chosenRestaurant.cuisine}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>
            {"$".repeat(Number(chosenRestaurant.price) || 0)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Rating:</Text>
          <Text style={styles.value}>
            {"★".repeat(Number(chosenRestaurant.rating) || 0)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{chosenRestaurant.phone}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{chosenRestaurant.address}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Website:</Text>
          <Text style={styles.value}>{chosenRestaurant.website}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Delivery:</Text>
          <Text style={styles.value}>
            {chosenRestaurant.delivery === "Yes" ? "Yes" : "No"}
          </Text>
        </View>
      </View>

      <CustomButton
        text="All Done!"
        onPress={() => navigation.navigate("DecisionTime")}
        buttonStyle={styles.doneButton}
        width="94%"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  headline: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  detailsBox: {
    width: "90%",
    borderWidth: 2,
    borderColor: "#c0c0c0",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    backgroundColor: "#f9f9f9",
  },
  detailRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    width: 80,
    color: "#333",
  },
  value: {
    fontSize: 16,
    flex: 1,
    color: "#555",
  },
  doneButton: {
    backgroundColor: "#007bff",
  },
});