import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet, Text, Image } from "react-native";
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MAP_BOX_TOKEN } from '../mapbox/key.js';


import IconButton from "../components/UI/IconButton";
import Marker from "../components/UI/Marker";

// set MapLibreGL to mapbox tile server
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
        // latitudeDelta: 0.0888, // prej 0.0922 
        // longitudeDelta: 0.0405,
        zoomLevel: 10,
    };

    function selectLocationHandler(event) {
        if (initialLocation) {
            return;
        }
        const lat = event.geometry.coordinates[1];
        const lng = event.geometry.coordinates[0];
        console.log("lat: " + lat + " lng: " + lng);
        const google_lat = 46.2947004;
        const google_lng = 13.9153237;
        console.log("google_lat: " + google_lat + " google_lng: " + google_lng);
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
            <MapLibreGL.MapView
                style={styles.map}
                logoEnabled={false}
                styleURL="mapbox://styles/miro-sodja/clfwhbge3009401mztl3f09x4" cle
                onPress={selectLocationHandler}
                initialLocation={region}
                projectionMode="mercator"
            >
                <MapLibreGL.Camera
                    defaultSettings={{
                        centerCoordinate: [region.longitude, region.latitude],
                        zoomLevel: region.zoomLevel,
                    }}
                />
                {selectedLocation && (
                    <MapLibreGL.MarkerView coordinate={[selectedLocation.lng, selectedLocation.lat]}>
                        <Marker />
                    </MapLibreGL.MarkerView>
                )}
            </MapLibreGL.MapView>
        </>
    );
}

export default Map;

const styles = StyleSheet.create({
    map: {
        flex: 1,
    }
});