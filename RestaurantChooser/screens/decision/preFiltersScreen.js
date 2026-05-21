import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/customButton";

export default function PreFiltersScreen({ navigation }) {
  const route = useRoute();
  const { participants } = route.params;

  const [cuisine, setCuisine] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [delivery, setDelivery] = useState("");

  const handleNext = async () => {
    const data = await AsyncStorage.getItem("restaurants");
    if (!data) {
      Alert.alert("No restaurants", "No restaurants found. Please add some first.");
      return;
    }

    const parsedRestaurants = JSON.parse(data);

    const filteredRestaurants = parsedRestaurants.filter((restaurant) => {
      const matchesCuisine = !cuisine || restaurant.cuisine === cuisine;
      const matchesPrice = !price || Number(restaurant.price) <= Number(price);
      const matchesRating = !rating || Number(restaurant.rating) >= Number(rating);
      const matchesDelivery =
        !delivery ||
        restaurant.delivery === delivery ||
        restaurant.delivery?.toLowerCase() === delivery.toLowerCase();

      return matchesCuisine && matchesPrice && matchesRating && matchesDelivery;
    });

    if (filteredRestaurants.length === 0) {
      Alert.alert(
        "No matches",
        "No restaurants match the selected criteria. Please adjust your filters.",
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate("Choice", {
      participants,
      restaurants: filteredRestaurants,
    });
  };

  return (
    <ScrollView style={styles.preFiltersContainer}>
      <View style={styles.preFiltersInnerContainer}>
        <View style={styles.preFiltersScreenFormContainer}>
          <View style={styles.preFiltersHeadlineContainer}>
            <Text style={styles.preFiltersHeadline}>Pre-Filters</Text>
          </View>

          <Text style={styles.fieldLabel}>Cuisine</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cuisine}
              onValueChange={(value) => setCuisine(value)}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="American" value="American" />
              <Picker.Item label="Chinese" value="Chinese" />
              <Picker.Item label="Italian" value="Italian" />
              <Picker.Item label="Indian" value="Indian" />
              <Picker.Item label="Mexican" value="Mexican" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Max Price</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={price}
              onValueChange={(value) => setPrice(value)}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="$" value="1" />
              <Picker.Item label="$$" value="2" />
              <Picker.Item label="$$$" value="3" />
              <Picker.Item label="$$$$" value="4" />
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Min Rating</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={rating}
              onValueChange={(value) => setRating(value)}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="1 Star" value="1" />
              <Picker.Item label="2 Stars" value="2" />
              <Picker.Item label="3 Stars" value="3" />
              <Picker.Item label="4 Stars" value="4" />
              <Picker.Item label="5 Stars" value="5" />
            </Picker>
          </View>

          <Text style={styles.fieldLabel}>Delivery</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={delivery}
              onValueChange={(value) => setDelivery(value)}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>

          <CustomButton
            text="Next"
            onPress={handleNext}
            buttonStyle={styles.nextButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  preFiltersContainer: {},
  preFiltersInnerContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
    width: "100%",
  },
  preFiltersScreenFormContainer: {
    width: "96%",
  },
  preFiltersHeadlineContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  preFiltersHeadline: {
    fontSize: 30,
    fontWeight: "bold",
  },
  fieldLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  pickerContainer: {
    ...Platform.select({
      ios: {
        width: "96%",
        borderRadius: 8,
        borderColor: "#c0c0c0",
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
      android: {
        width: "96%",
        borderRadius: 8,
        borderColor: "#c0c0c0",
        borderWidth: 2,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
    }),
  },
  picker: {
    ...Platform.select({
      ios: {},
      android: {},
    }),
  },
  nextButton: {
    backgroundColor: "#007bff",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
});