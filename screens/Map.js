import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapLibreGL from '@maplibre/maplibre-react-native';
import {
    getCurrentPositionAsync, 
    useForegroundPermissions, 
    PermissionStatus
} from "expo-location";
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
    const [locationPermissionInformation, requestPermission] =
        useForegroundPermissions();
    const [marker, setMarker] = useState(null);


    const region = {
        //TODO popravi zoom in koordinate
        latitude: selectedLocation ? selectedLocation.lat : 46.310376,
        longitude: selectedLocation ? selectedLocation.lng : 13.827434,
        zoomLevel: selectedLocation ? 12 : 16,
    };

    // TODO: export for outside use and permission check

    async function verifyPermission() {
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
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
            return;
        }

        const location = await getCurrentPositionAsync();
        console.log(location.coords.latitude, location.coords.longitude);
    }

    function selectLocationHandler(event) {
        const lat = event.geometry.coordinates[1];
        const lng = event.geometry.coordinates[0];
        setSelectedLocation({ lat: lat, lng: lng });
    }

    const onMapPress = async (event) => {
        setMarker({ coordinates: event.geometry.coordinates });
        setTimeout(() => {
            setMarker(null);
        }, 5000);
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
                />
                {selectedLocation && (
                    <MapLibreGL.PointAnnotation id="1" coordinate={[selectedLocation.lng, selectedLocation.lat]} />
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