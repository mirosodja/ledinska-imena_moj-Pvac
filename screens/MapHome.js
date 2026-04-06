import SharedMapScreen from "../components/Map/SharedMapScreen";

function MapHome({ navigation, route }) {
  return <SharedMapScreen navigation={navigation} route={route} variant="home" />;
}

export default MapHome;
