import SharedMapScreen from "../components/Map/SharedMapScreen";

function Map({ navigation, route }) {
  return <SharedMapScreen navigation={navigation} route={route} variant="picker" />;
}

export default Map;
