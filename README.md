🍽 RestaurantChooser
A React Native mobile app to help groups decide where to eat
Overview
RestaurantChooser is a cross-platform React Native application built with Expo SDK 54. It solves the everyday problem of groups being unable to agree on where to eat by randomly selecting a restaurant based on the group's preferences and allowing any participant to veto the choice. The app manages three core data sets — People, Restaurants, and Decisions — all persisted locally on the device using AsyncStorage.

Features
•	Add, view, and delete people who will be part of the decision
•	Add restaurants with full details: name, cuisine, price, rating, phone, address, website, and delivery option
•	Field validation on all forms with inline error messages
•	Decision flow: select participants, apply pre-filters (cuisine, price, rating, delivery), then randomly pick a restaurant
•	Veto system: any participant who has not yet vetoed can reject a chosen restaurant; the app re-picks from the remaining list
•	Accept flow: accepting a restaurant navigates to a full PostChoice detail screen
•	Guards against starting a decision with no people or no restaurants
•	Material Top Tab navigation with custom icons for People, Decision, and Restaurants tabs
•	Toast notifications for save success and delete confirmations

Tech Stack
Framework	React Native 0.76.9 (Expo SDK 54)
Storage	AsyncStorage (@react-native-async-storage/async-storage v2.1.2)
Navigation	@react-navigation/native v7 + material-top-tabs + stack
UI Feedback	react-native-toast-message v2
Pickers	@react-native-picker/picker v2
Checkboxes	expo-checkbox
Language	JavaScript (ES2022)
Package Mgr	npm

Project Structure
RestaurantChooser/
├── App.js                         Root component
├── index.js                       Expo entry point
├── app.json                       Expo config
├── package.json
├── assets/                        Icons and splash images
├── components/
│   ├── customButton.js            Reusable button component
│   ├── customTextInput.js         Reusable text input with label & error
│   └── navigation.js              Material top tab navigator
└── screens/
    ├── people/
    │   ├── peopleScreen.js        Stack navigator for People tab
    │   ├── listScreen.js          List of all people
    │   ├── addScreen.js           Add person form
    │   └── validators.js          First/last name validation
    ├── restaurants/
    │   ├── restaurantsScreen.js   Stack navigator for Restaurants tab
    │   ├── listScreen.js          List of all restaurants
    │   ├── addScreen.js           Add restaurant form
    │   └── validators.js          Name/phone/address/website validation
    └── decision/
        ├── decisionScreenNavigation.js  Stack navigator for Decision tab
        ├── decisionScreen.js      'It's Decision Time' landing screen
        ├── whosGoingScreen.js     Checkbox list of participants
        ├── preFiltersScreen.js    Filter pickers (cuisine/price/rating/delivery)
        ├── choiceScreen.js        Random picker with veto/accept modals
        └── postChoiceScreen.js    Final chosen restaurant detail screen

Setup & Installation
1.	Clone the repository:
git clone https://github.com/YOUR_USERNAME/RestaurantChooser.git
cd RestaurantChooser
2.	Install dependencies:
npm install
3.	Fix version alignment:
npx expo install --fix
4.	Install expo-checkbox (required for Who's Going screen):
npx expo install expo-checkbox
5.	Start the development server:
npx expo start --clear
6.	Open on Android emulator (press 'a') or scan QR code with Expo Go on your phone
Note: This app is mobile-only. The web build (localhost) will not render the navigation correctly due to react-native-gesture-handler and react-native-pager-view having no web implementations.

How the Decision Flow Works
Step 1	Decision tab — tap the image to start (guards check people & restaurants exist)
Step 2	Who's Going — check participants who will be choosing
Step 3	Pre-Filters — optionally filter by cuisine, max price, min rating, delivery
Step 4	Choice — tap 'Randomly Choose'; a modal shows the selected restaurant
Step 5 (Accept)	Tap Accept → navigate to PostChoice with full restaurant details
Step 5 (Veto)	Tap Veto → choose who is vetoing → restaurant removed from pool → re-pick
Step 6	Tap 'All Done!' on PostChoice to return to the Decision landing screen

Data Storage
All data is stored on-device using AsyncStorage under two keys:
'people'	JSON array of person objects {key, firstName, lastName, relationship}
'restaurants'	JSON array of restaurant objects {key, name, cuisine, price, rating, phone, address, website, delivery}
Data persists across app restarts. Uninstalling the app will erase all stored data. There is no cloud sync or user account system.

Assets Required
Place the following images in the assets/ folder. They are referenced as tab bar icons in navigation.js:
•	people.png — icon for the People tab
•	decision.png — icon for the Decision tab
•	restaurant.png — icon for the Restaurants tab
•	icon.png — app icon (1024×1024)
•	splash-icon.png — splash screen image

License
This project was created as a university assignment. All rights reserved.
