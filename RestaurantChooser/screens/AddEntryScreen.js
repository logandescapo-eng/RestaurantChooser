import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, Alert, Platform, SafeAreaView, ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { addJournalEntry } from "../db/database";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink", "Other"];

export default function AddEntryScreen({ navigation }) {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState("select"); // "select" | "camera" | "preview"
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Lunch");
  const [saving, setSaving] = useState(false);
  const cameraRef = useRef(null);

  // ── Camera ────────────────────────────────────────────────────────────────
  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permission Required", "Camera permission is needed to take photos.");
        return;
      }
    }
    setMode("camera");
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    setImageUri(photo.uri);
    setMode("preview");
  };

  // ── File Picker ───────────────────────────────────────────────────────────
  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Photo library permission is needed.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setMode("preview");
    }
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!imageUri) { Alert.alert("No image", "Please take or select a photo first."); return; }
    if (!description.trim()) { Alert.alert("Missing description", "Please add a description."); return; }
    setSaving(true);
    const result = await addJournalEntry(user.id, imageUri, description.trim(), category);
    setSaving(false);
    if (result.success) {
      setImageUri(null);
      setDescription("");
      setCategory("Lunch");
      setMode("select");
      Alert.alert("Saved!", "Your meal has been added to the journal.", [
        { text: "OK", onPress: () => navigation.navigate("Journal") },
      ]);
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const reset = () => { setImageUri(null); setMode("select"); };

  // ── Camera view ───────────────────────────────────────────────────────────
  if (mode === "camera") {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <View style={styles.cameraButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setMode("select")}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Meal</Text>

        {/* Image area */}
        {imageUri ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            <TouchableOpacity style={styles.retakeBtn} onPress={reset}>
              <Text style={styles.retakeBtnText}>Retake / Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <View style={styles.imageButtons}>
              <TouchableOpacity style={styles.imageBtn} onPress={openCamera}>
                <Text style={styles.imageBtnText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.imageBtn, styles.imageBtnSecondary]} onPress={pickFromLibrary}>
                <Text style={[styles.imageBtnText, styles.imageBtnTextSecondary]}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="What did you eat? How did it taste?"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={setCategory}>
            {CATEGORIES.map((c) => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>Done</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  inner: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "800", color: "#1a1a1a", marginBottom: 20 },
  imageWrapper: { marginBottom: 20, borderRadius: 16, overflow: "hidden" },
  preview: { width: "100%", height: 240, borderRadius: 16 },
  retakeBtn: { backgroundColor: "rgba(0,0,0,0.6)", padding: 10, alignItems: "center" },
  retakeBtnText: { color: "#fff", fontWeight: "600" },
  imagePlaceholder: {
    backgroundColor: "#fff", borderRadius: 16, borderWidth: 2,
    borderColor: "#f0d0c0", borderStyle: "dashed",
    height: 200, justifyContent: "center", alignItems: "center", marginBottom: 20,
  },
  placeholderIcon: { fontSize: 48, marginBottom: 14 },
  imageButtons: { flexDirection: "row", gap: 10 },
  imageBtn: {
    backgroundColor: "#E85D04", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16,
  },
  imageBtnSecondary: { backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#E85D04" },
  imageBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  imageBtnTextSecondary: { color: "#E85D04" },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  textArea: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1.5, borderColor: "#ddd",
    padding: 14, fontSize: 15, minHeight: 100, marginBottom: 18,
  },
  pickerContainer: {
    backgroundColor: "#fff", borderRadius: 12, borderWidth: 1.5, borderColor: "#ddd",
    marginBottom: 28, overflow: "hidden",
  },
  saveButton: {
    backgroundColor: "#E85D04", borderRadius: 14, padding: 18, alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  // Camera
  cameraContainer: { flex: 1 },
  camera: { flex: 1, justifyContent: "flex-end" },
  cameraControls: { paddingBottom: 40, alignItems: "center", gap: 20 },
  cameraButton: {
    width: 74, height: 74, borderRadius: 37, backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#fff",
  },
  cameraButtonInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#fff" },
  cancelBtn: { backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  cancelBtnText: { color: "#fff", fontWeight: "600" },
});