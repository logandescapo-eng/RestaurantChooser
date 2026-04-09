import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../../components/customTextInput";
import CustomButton from "../../components/customButton";
import {
  validateAddress,
  validateName,
  validatePhone,
  validateWebsite,
} from "./validators";
import Toast from "react-native-toast-message";

const AddScreen = ({ navigation }) => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    cuisine: "",
    rating: "",
    price: "",
    delivery: "",
    key: `r_${new Date().getTime()}`,
    errors: {},
  });

  const setField = (field, value) => {
    setRestaurant((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: null },
    }));
  };

  const validateAllFields = () => {
    const { name, address, phone, website, cuisine, rating, price, delivery } = restaurant;
    const errors = {
      name: validateName(name),
      address: validateAddress(address),
      phone: validatePhone(phone),
      website: validateWebsite(website),
      cuisine: !cuisine ? "Cuisine type is required" : null,
      rating: !rating ? "Rating is required" : null,
      price: !price ? "Price range is required" : null,
      delivery: !delivery ? "Delivery option is required" : null,
    };
    setRestaurant((prev) => ({ ...prev, errors }));
    return { isValid: !Object.values(errors).some((e) => e !== null), errors };
  };

  const saveRestaurant = async () => {
    const { isValid, errors } = validateAllFields();
    if (!isValid) {
      const firstErrorField = Object.keys(errors).find((k) => errors[k]);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Validation error",
        text2: firstErrorField ? errors[firstErrorField] : "Please fix the errors above",
        visibilityTime: 3000,
      });
      return;
    }
    try {
      const existingData = await AsyncStorage.getItem("restaurants");
      const restaurants = existingData ? JSON.parse(existingData) : [];
      restaurants.push(restaurant);
      await AsyncStorage.setItem("restaurants", JSON.stringify(restaurants));
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Restaurant saved successfully",
        visibilityTime: 2000,
      });
      navigation.navigate("RestaurantsList");
    } catch (error) {
      console.error("Failed to save restaurant:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error saving restaurant",
        text2: "Please try again later",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <ScrollView>
      <View style={styles.addScreenInnerContainer}>
        <View style={styles.addScreenFormContainer}>

          <CustomTextInput
            label="Name"
            maxLength={50}
            value={restaurant.name}
            onChangeText={(text) => setField("name", text)}
            error={restaurant.errors.name}
          />

          <Text style={styles.fieldLabel}>Cuisine</Text>
          <View style={styles.pickerContainer}>
            <Picker
              prompt="Cuisine"
              selectedValue={restaurant.cuisine}
              onValueChange={(value) => setField("cuisine", value)}
              style={[styles.picker, restaurant.errors.cuisine ? { borderColor: "red" } : {}]}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="American" value="American" />
              <Picker.Item label="Chinese" value="Chinese" />
              <Picker.Item label="Italian" value="Italian" />
              <Picker.Item label="Mexican" value="Mexican" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          {restaurant.errors.cuisine && (
            <Text style={styles.errorText}>{restaurant.errors.cuisine}</Text>
          )}

          <Text style={styles.fieldLabel}>Price</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={restaurant.price}
              onValueChange={(value) => setField("price", value)}
              style={[styles.picker, restaurant.errors.price ? { borderColor: "red" } : {}]}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>
          {restaurant.errors.price && (
            <Text style={styles.errorText}>{restaurant.errors.price}</Text>
          )}

          <Text style={styles.fieldLabel}>Rating</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={restaurant.rating}
              onValueChange={(value) => setField("rating", value)}
              style={[styles.picker, restaurant.errors.rating ? { borderColor: "red" } : {}]}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>
          {restaurant.errors.rating && (
            <Text style={styles.errorText}>{restaurant.errors.rating}</Text>
          )}

          <CustomTextInput
            label="Phone"
            maxLength={20}
            value={restaurant.phone}
            onChangeText={(text) => setField("phone", text)}
            error={restaurant.errors.phone}
            keyboardType="phone-pad"
          />
          <CustomTextInput
            label="Address"
            maxLength={50}
            value={restaurant.address}
            onChangeText={(text) => setField("address", text)}
            error={restaurant.errors.address}
          />
          <CustomTextInput
            label="Website"
            maxLength={50}
            value={restaurant.website}
            onChangeText={(text) => setField("website", text)}
            error={restaurant.errors.website}
            keyboardType="url"
            autoCapitalize="none"
          />

          <Text style={styles.fieldLabel}>Delivery?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={restaurant.delivery}
              onValueChange={(value) => setField("delivery", value)}
              style={[styles.picker, restaurant.errors.delivery ? { borderColor: "red" } : {}]}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
          {restaurant.errors.delivery && (
            <Text style={styles.errorText}>{restaurant.errors.delivery}</Text>
          )}

        </View>

        <View style={styles.addScreenButtonsContainer}>
          <CustomButton
            text="Cancel"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.cancelButton}
          />
          <CustomButton
            text="Save"
            onPress={saveRestaurant}
            buttonStyle={styles.saveButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  addScreenInnerContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    width: "100%",
  },
  addScreenFormContainer: { width: "96%" },
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
  errorText: {
    color: "red",
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  addScreenButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
    gap: 10,
  },
  cancelButton: { backgroundColor: "gray", width: "44%" },
  saveButton: { backgroundColor: "green", width: "44%" },
});

export default AddScreen;