import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MAP_BOX_TOKEN } from '../mapbox/key.js';


import IconButton from "../components/UI/IconButton";

MapLibreGL.setAccessToken(MAP_BOX_TOKEN);

function Map({ navigation, route }) {
    const initialLocation = route.params && {
        lat: route.params.initialLat,
        lng: route.params.initialLng
    };

    const [selectedLocation, setSelectedLocation] = useState(initialLocation);


    const region = {
        latitude: initialLocation ? initialLocation.lat : 46.291133,
        longitude: initialLocation ? initialLocation.lng : 13.893405,
        latitudeDelta: 0.0888, // prej 0.0922 
        longitudeDelta: 0.0405,

    };

    function selectLocationHandler(event) {
        if (initialLocation) {
            return;
        }
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;

        setSelectedLocation({ lat: lat, lng: lng });
    }

    const savedPickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert(
                "No location picked!",
                "You have to pick a location (by tapping on the map) first!"
            );
            return;
        }

        navigation.navigate("AddPlace", {
            pickedLat: selectedLocation.lat,
            pickedLng: selectedLocation.lng,
        });
    }, [navigation, selectedLocation]);

    useLayoutEffect(() => {
        if (initialLocation) {
            return;
        }
        navigation.setOptions({
            headerRight: ({ tintColor }) => (
                <IconButton
                    icon="save"
                    size={24}
                    color={tintColor}
                    onPress={savedPickedLocationHandler}
                />
            ),
        });
    }, [navigation, savedPickedLocationHandler]);

    return (
        <>
            {/* <MapView
                style={styles.map}
                initialRegion={region}
                onPress={selectLocationHandler}
            >
                {selectedLocation && (
                    <Marker
                        title="Picked Location"
                        coordinate={{
                            latitude: selectedLocation.lat,
                            longitude: selectedLocation.lng
                        }}
                    />
                )}
            </MapView> */}

            <MapLibreGL.MapView
                style={styles.map}
                logoEnabled={false}
                styleURL="mapbox://styles/miro-sodja/clfwhbge3009401mztl3f09x4"
            />
        </>
    );
}

export default Map;

const styles = StyleSheet.create({
    map: {
        flex: 1,
    }
});