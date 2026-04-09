import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../../components/customTextInput";
import CustomButton from "../../components/customButton";
import { validateFirstName, validateLastName } from "./validators";
import Toast from "react-native-toast-message";

const AddScreen = ({ navigation }) => {
  const [person, setPerson] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    key: `p_${new Date().getTime()}`,
    errors: {},
  });

  const setField = (field, value) => {
    setPerson((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: null },
    }));
  };

  const validateAllFields = () => {
    const { firstName, lastName, relationship } = person;
    const errors = {
      firstName: validateFirstName(firstName),
      lastName: validateLastName(lastName),
      relationship: !relationship ? "Relationship is required" : null,
    };
    setPerson((prev) => ({ ...prev, errors }));
    return { isValid: !Object.values(errors).some((e) => e !== null), errors };
  };

  const savePerson = async () => {
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
      const existingData = await AsyncStorage.getItem("people");
      const people = existingData ? JSON.parse(existingData) : [];
      people.push(person);
      await AsyncStorage.setItem("people", JSON.stringify(people));
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Person saved successfully",
        visibilityTime: 2000,
      });
      navigation.navigate("PeopleList");
    } catch (error) {
      console.error("Failed to save person:", error);
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error saving person",
        text2: "Please try again later",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.formContainer}>

          <CustomTextInput
            label="First Name"
            maxLength={50}
            value={person.firstName}
            onChangeText={(text) => setField("firstName", text)}
            error={person.errors.firstName}
          />

          <CustomTextInput
            label="Last Name"
            maxLength={50}
            value={person.lastName}
            onChangeText={(text) => setField("lastName", text)}
            error={person.errors.lastName}
          />

          <View style={styles.pickerContainer}>
            <Picker
              prompt="Relationship"
              selectedValue={person.relationship}
              onValueChange={(value) => setField("relationship", value)}
              style={[styles.picker, person.errors.relationship ? { borderColor: "red" } : {}]}
            >
              <Picker.Item label="Select relationship" value="" />
              <Picker.Item label="Me" value="Me" />
              <Picker.Item label="Family" value="Family" />
              <Picker.Item label="Friend" value="Friend" />
              <Picker.Item label="Coworker" value="Coworker" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

        </View>

        <View style={styles.buttonsContainer}>
          <CustomButton
            text="Cancel"
            onPress={() => navigation.goBack()}
            buttonStyle={styles.cancelButton}
          />
          <CustomButton
            text="Save"
            onPress={savePerson}
            buttonStyle={styles.saveButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    width: "100%",
  },
  formContainer: { width: "96%" },
  pickerContainer: {
    width: "96%",
    borderRadius: 8,
    borderColor: "#c0c0c0",
    borderWidth: 2,
    marginLeft: 10,
    marginBottom: 20,
    marginTop: 4,
  },
  picker: {},
  buttonsContainer: {
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