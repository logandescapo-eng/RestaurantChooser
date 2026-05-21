import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../../components/customButton";

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function ChoiceScreen({ navigation }) {
  const route = useRoute();
  const [participants, setParticipants] = useState(route.params.participants);
  const [restaurants, setRestaurants] = useState(route.params.restaurants);
  const [chosenRestaurant, setChosenRestaurant] = useState(null);
  const [selectedVisible, setSelectedVisible] = useState(false);
  const [vetoVisible, setVetoVisible] = useState(false);

  const allVetoed = participants.every((p) => p.vetoed === "yes");
  const vetoDisabled = allVetoed;
  const vetoText = allVetoed ? "No Vetoes Remaining" : "Veto";

  const selectRandomRestaurant = () => {
    if (!restaurants || restaurants.length === 0) {
      Alert.alert(
        "No restaurants left",
        "All restaurants have been vetoed! Everyone must eat at home.",
        [{ text: "OK", onPress: () => navigation.navigate("DecisionTime") }]
      );
      return;
    }
    const index = getRandom(0, restaurants.length - 1);
    setChosenRestaurant(restaurants[index]);
    setSelectedVisible(true);
  };

  const handleAccept = () => {
    setSelectedVisible(false);
    navigation.navigate("PostChoice", { chosenRestaurant });
  };

  const handleVetoPress = () => {
    setSelectedVisible(false);
    setVetoVisible(true);
  };

  const handleVetoBy = (person) => {
    // Mark this person as having vetoed
    const updatedParticipants = participants.map((p) =>
      p.key === person.key ? { ...p, vetoed: "yes" } : p
    );
    setParticipants(updatedParticipants);

    // Remove the vetoed restaurant
    const updatedRestaurants = restaurants.filter(
      (r) => !!r && r.key !== chosenRestaurant.key
    );
    setRestaurants(updatedRestaurants);

    setVetoVisible(false);
    setChosenRestaurant(null);

    if (updatedRestaurants.length === 0) {
      Alert.alert(
        "No restaurants left",
        "All restaurants have been vetoed! No decision can be made.",
        [{ text: "OK", onPress: () => navigation.navigate("DecisionTime") }]
      );
      return;
    }

    if (updatedRestaurants.length === 1) {
      // Only one left — go straight to it
      navigation.navigate("PostChoice", {
        chosenRestaurant: updatedRestaurants[0],
      });
      return;
    }

    // More remain — show choice screen again to re-pick
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Make a Choice</Text>

      <FlatList
        style={styles.choiceScreenListContainer}
        data={participants.filter((x) => !!x)}
        keyExtractor={(item) => item?.key || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.choiceScreenListItem}>
            <Text style={styles.choiceScreenListItemName}>
              {item.firstName} {item.lastName} ({item.relationship})
            </Text>
            <Text>Vetoed: {item.vetoed || "no"}</Text>
          </View>
        )}
      />

      <CustomButton
        text="Randomly Choose"
        width="94%"
        onPress={selectRandomRestaurant}
        buttonStyle={styles.chooseButton}
      />

      {/* Selection Modal */}
      <Modal
        visible={selectedVisible}
        animationType="slide"
        transparent={false}
      >
        {chosenRestaurant ? (
          <View style={styles.selectedContainer}>
            <View style={styles.selectedInnerContainer}>
              <Text style={styles.selectedName}>{chosenRestaurant?.name}</Text>
              <View style={styles.selectedDetails}>
                <Text style={styles.selectedDetailsLine}>
                  This is a {"★".repeat(Number(chosenRestaurant?.rating) || 0)} star
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  {chosenRestaurant?.cuisine} restaurant
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  with a price rating of {"$".repeat(Number(chosenRestaurant?.price) || 0)}
                </Text>
                <Text style={styles.selectedDetailsLine}>
                  that {chosenRestaurant?.delivery === "Yes" ? "DOES" : "DOES NOT"} deliver
                </Text>
              </View>
              <CustomButton
                text="Accept"
                width="94%"
                onPress={handleAccept}
                buttonStyle={styles.acceptButton}
              />
              <CustomButton
                text={vetoText}
                width="94%"
                onPress={handleVetoPress}
                disabled={vetoDisabled}
                buttonStyle={styles.vetoButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.selectedContainer}>
            <Text>No restaurant selected.</Text>
          </View>
        )}
      </Modal>

      {/* Veto Modal */}
      <Modal
        visible={vetoVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {}}
      >
        <View style={styles.vetoContainer}>
          <View style={styles.vetoContainerInner}>
            <Text style={styles.vetoHeadline}>Who is vetoing?</Text>
            <ScrollView style={styles.vetoScrollViewContainer}>
              {participants
                .filter((p) => p.vetoed === "no")
                .map((p) => (
                  <TouchableOpacity
                    key={p.key}
                    style={styles.vetoParticipantContainer}
                    onPress={() => handleVetoBy(p)}
                  >
                    <Text style={styles.vetoParticipantName}>
                      {p.firstName} {p.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.vetoButtonContainer}>
              <CustomButton
                text="Never Mind"
                width="94%"
                onPress={() => {
                  setVetoVisible(false);
                  setSelectedVisible(true);
                }}
                buttonStyle={styles.neverMindButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headline: {
    fontSize: 30,
    fontWeight: "bold",
  },
  choiceScreenListContainer: {
    width: "94%",
  },
  choiceScreenListItem: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 4,
    borderBottomWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    paddingVertical: 8,
  },
  choiceScreenListItemName: {
    flex: 1,
    fontSize: 16,
  },
  chooseButton: {
    backgroundColor: "#007bff",
  },
  selectedContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  selectedInnerContainer: {
    alignItems: "center",
    padding: 20,
  },
  selectedName: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  selectedDetails: {
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  selectedDetailsLine: {
    fontSize: 18,
    marginBottom: 6,
    textAlign: "center",
  },
  acceptButton: {
    backgroundColor: "green",
    marginBottom: 12,
  },
  vetoButton: {
    backgroundColor: "#ff0000",
  },
  vetoContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  vetoContainerInner: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 20,
  },
  vetoHeadline: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  vetoScrollViewContainer: {
    height: "50%",
    width: "100%",
  },
  vetoParticipantContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    width: "100%",
    alignItems: "center",
  },
  vetoParticipantName: {
    fontSize: 24,
  },
  vetoButtonContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
  },
  neverMindButton: {
    backgroundColor: "#888",
  },
});