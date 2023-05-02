import { useCallback, useLayoutEffect, useState, useRef } from "react";
import { Alert, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from 'expo-location';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MAP_BOX_TOKEN } from '../mapbox/key.js';


import IconButton from "../components/UI/IconButton";

// set MapLibreGL to mapbox tile server
MapLibreGL.setAccessToken(MAP_BOX_TOKEN);



function Map({ navigation, route }) {

    const initialLocation = route.params && {
        lat: route.params.initialLat,
        lng: route.params.initialLng,
        zoomLevel: route.params.initialZoomLevel,
    };
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [location, setLocation] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const mapRef = useRef(null);


    const region = {
        latitude: initialLocation ? initialLocation.lat : 46.2949265,
        longitude: initialLocation ? initialLocation.lng : 13.9140825,
        zoomLevel: initialLocation ? initialLocation.zoomLevel : 16,
    };


    function selectLocationHandler(event) {
        const lat = event.geometry.coordinates[1];
        const lng = event.geometry.coordinates[0];
        setSelectedLocation({ lat: lat, lng: lng, zoomLevel: zoomLevel });
    }

    const getLocationHandler = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Premalo dovoljenj!',
                'Aplikaciji morate v Nastavitvah omogočiti dostop do lokacije na napravi.',
                [{ text: 'V redu' }]
            );
            return;
        }
        setIsLoading(true);
        const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation({ lat: currentLocation.coords.latitude, lng: currentLocation.coords.longitude, zoomLevel: zoomLevel ? zoomLevel : region.zoomLevel });
        setTimeout(() => {
            setLocation(null);
        }, 2000);
        if (mapRef.current) {
            mapRef.current.setCamera({
                centerCoordinate: [currentLocation.coords.longitude, currentLocation.coords.latitude], zoomLevel: zoomLevel ? zoomLevel : region.zoomLevel
            });
        }
        setIsLoading(false);
    };

    const savedPickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert(
                "Niste izbrali Pváca!",
                "Pvác izberete tako, da tapnete na mapo!"
            );
            return;
        }

        navigation.navigate("AddPlace", {
            pickedLat: selectedLocation.lat,
            pickedLng: selectedLocation.lng,
        });
    }, [navigation, selectedLocation]);

    useLayoutEffect(() => {
        if (route.params && !route.params.showHeaderButton) {
            return;
        }
        navigation.setOptions({
            headerRight: ({ tintColor }) => (
                <>
                    <IconButton
                        icon="save"
                        size={24}
                        color={tintColor}
                        onPress={savedPickedLocationHandler}
                    />
                    <IconButton
                        icon="location"
                        size={24}
                        color={tintColor}
                        onPress={getLocationHandler}
                    />
                </>
            ),
        });
    }, [navigation, savedPickedLocationHandler]);

    const handleRegionDidChange = async (event) => {
        const newZoomLevel = event.properties.zoomLevel;
        setZoomLevel(newZoomLevel);
        setIsLoading(false);
    };

    return (
        <>
            {isLoading && (<ActivityIndicator size="large" color="#0000ff" />)}
            <MapLibreGL.MapView
                style={styles.map}
                logoEnabled={false}
                styleURL="mapbox://styles/miro-sodja/clfwhbge3009401mztl3f09x4"
                onPress={selectLocationHandler}
                onRegionDidChange={handleRegionDidChange}
                projectionMode="mercator"
            >
                <MapLibreGL.Camera
                    defaultSettings={{
                        centerCoordinate: [region.longitude, region.latitude],
                        zoomLevel: region.zoomLevel,
                    }}
                    ref={mapRef}
                />
                {selectedLocation && (
                    <MapLibreGL.PointAnnotation id="1" coordinate={[selectedLocation.lng, selectedLocation.lat]} />
                )}
                {location && (
                    <MapLibreGL.PointAnnotation id="2" coordinate={[location.lng, location.lat]} />
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
