import { useCallback, useLayoutEffect, useState, useEffect, useRef } from "react";
import { Alert, StyleSheet } from "react-native";
import {
    getCurrentPositionAsync,
    PermissionStatus,
    useForegroundPermissions,
} from "expo-location";
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MAP_BOX_TOKEN } from '../mapbox/key.js';


import IconButton from "../components/UI/IconButton";

// set MapLibreGL to mapbox tile server
MapLibreGL.setAccessToken(MAP_BOX_TOKEN);



function Map({ navigation, route }) {

    const initialLocation = route.params && {
        lat: route.params.initialLat,
        lng: route.params.initialLng
    };
    // TODO: change initial location to current location
    // TODO: extract boolean from route.params to show or not show header button
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationPermissionInformation, requestPermission] =
        useForegroundPermissions();
    const mapRef = useRef(null);

    const region = {
        latitude: selectedLocation ? selectedLocation.lat : 46.310376,
        longitude: selectedLocation ? selectedLocation.lng : 13.827434,
        zoomLevel: selectedLocation ? 12 : 16,
    };

    // TODO: export for outside use and permission check

    async function verifyPermissions() {
        if (
            locationPermissionInformation.status === PermissionStatus.UNDETERMINED
        ) {
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }

        if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Premalo dovoljenj!',
                'Aplikaciji morate omogočiti dostop do lokacije na napravi.'
            );
            return false;
        }

        return true;
    }

    async function getCurrentLocationHandler() {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        const location = await getCurrentPositionAsync();
        setCurrentLocation({
            lng: location.coords.longitude,
            lat: location.coords.latitude,
        });
        console.log(currentLocation);
        await showMarker();
    }

    function selectLocationHandler(event) {
        const lat = event.geometry.coordinates[1];
        const lng = event.geometry.coordinates[0];
        setSelectedLocation({ lat: lat, lng: lng });
    }
    // TODO: add useEffect to set camera to current location
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setCamera({
                centerCoordinate: [currentLocation.lng, currentLocation.lat],
                zoomLevel: region.zoomLevel
            });
        }
    }, [region]);

    const showMarker = async () => {
        setTimeout(() => {
            setCurrentLocation(null);
        }, 3000);
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
                        onPress={getCurrentLocationHandler}
                    />
                </>
            ),
        });
    }, [navigation, savedPickedLocationHandler]);

    return (
        <>
            <MapLibreGL.MapView
                style={styles.map}
                logoEnabled={false}
                styleURL="mapbox://styles/miro-sodja/clfwhbge3009401mztl3f09x4"
                onPress={selectLocationHandler}
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
                {currentLocation && (<MapLibreGL.PointAnnotation id="2" coordinate={[currentLocation.lng, currentLocation.lat]} />)}
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