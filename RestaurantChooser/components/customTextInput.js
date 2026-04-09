import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";

const CustomTextInput = ({ label, labelStyle, maxLength, textInputStyle, stateHolder, stateFieldName, ...rest }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <TextInput
        style={[styles.input, textInputStyle, rest.error ? styles.inputError : null]}
        maxLength={maxLength}
        value={stateHolder ? stateHolder[stateFieldName] : rest.value}
        onChangeText={rest.onChangeText}
        keyboardType={rest.keyboardType || "default"}
        autoCapitalize={rest.autoCapitalize || "sentences"}
        {...rest}
      />
      {rest.error ? <Text style={styles.errorText}>{rest.error}</Text> : null}
    </View>
  );
};

CustomTextInput.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  maxLength: PropTypes.number,
  textInputStyle: PropTypes.object,
  stateHolder: PropTypes.object,
  stateFieldName: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#c0c0c0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTextInput;