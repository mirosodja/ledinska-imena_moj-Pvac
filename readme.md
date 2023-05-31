# Application Overview
Moj Pvac is a mobile application built using React Native and Expo framework. The main purpose of this application is for users to save the locations with local toponyms they have visited.

## Features
* User can save a place with a local toponym, description, and image.
* A list of all saved places is displayed to the user.
* User can view details of a saved place including its location on the map and local toponym.
* User can edit details of a saved place.
* User can search for a place on the map and save it as a new place.
* User can view information about the application.
## Dependencies
* `react`
* `react-native`
* `react-native-maps`
* `@react-navigation`
* `expo-splash-screen`
* `expo-font`
* `expo-status-bar`
* `expo-location`
* `@maplibre/maplibre-react-native`
* `@react-native-community/netinfo`
* `sqllite`
## Getting Started
1. Expo CLI has to be installed while project is expo bare workflow https://docs.expo.dev/archive/managed-vs-bare/.
2. Clone or download the repository.
3. Navigate to the project's directory and run `npm install`.
4. Run `npm run android` to start the development server.
5. Open the application on an emulator or a physical device using the Expo App.
## Technologies Used
* React Native
* Expo
* MapLibreGL (mapboxToken is imported from ./mapbox/mapboxtoken.js but file is ignored by git)
* SQLite
## Conclusion
This application provides an easy way for users to save places they have visited. It provides functionalities that allow the user to search for a place using the map and add it as a new place. It also provides a simple user interface with different screens to navigate through the application.
## License

The content of this repository is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

This means you are free to use, share, and adapt the content in this repository, including the data sourced from the [Flu-Led – ledinskaimena.si](https://www.flurnamen.at/prenos/), as long as you provide appropriate attribution to the original creator.
