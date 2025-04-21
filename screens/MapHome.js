import { useLayoutEffect, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Alert, StyleSheet, ActivityIndicator, Text, View } from "react-native";
import * as Location from 'expo-location';
import MapLibreGL from '@maplibre/maplibre-react-native';
import NetInfo from "@react-native-community/netinfo";
import { Colors } from "../constants/colors";
import IconButton from "../components/UI/IconButton";

// set MapLibreGL to mapbox tile server
//TODO comment this line when you build the app with eas
import { mapboxToken } from "../mapbox/mapboxtoken";
//TODO uncomment this line when you build the app with eas
// import Constants from 'expo-constants';
// const mapboxToken = Constants.manifest.extra.mapboxToken;
MapLibreGL.setAccessToken(mapboxToken);


function MapHome({ navigation }) {

    const [currentLocation, setCurrentLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setOfflineStatus] = useState(false);
    let currentZoomLevel = 8.1;

    const mapRef = useRef(null);
    const attributionPosition = useMemo(() => ({ top: 8, left: 8 }), []);

    const region =
    {
        latitude: 46.355280,
        longitude: 14.188080,
        zoomLevel: currentZoomLevel
    };

    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        return () => removeNetInfoSubscription();
    }, []);

    const moveMap = (longitude, latitude, zoomLevel) => {
        if (mapRef.current) {
            setIsLoading(true);
            mapRef.current.setCamera({
                centerCoordinate: [longitude, latitude],
                zoomLevel: zoomLevel,
                animationDuration: 2000,
            });
        }
    }

    const handleRegionDidChange = async (event) => {
        setIsLoading(false);
    };

    const getLocationHandler = useCallback(async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Premalo dovoljenj!',
                'Aplikaciji morate v Nastavitvah omogočiti dostop do lokacije na napravi.',
                [{ text: 'V redu' }]
            );
            return;
        }
        const locationGps = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        let adjustedZoomLevel = currentZoomLevel;
        if (adjustedZoomLevel < 15) {
            adjustedZoomLevel = (15 + currentZoomLevel) / 2;
            currentZoomLevel = adjustedZoomLevel;
        }
        moveMap(locationGps.coords.longitude, locationGps.coords.latitude, adjustedZoomLevel);
        setCurrentLocation({ lat: locationGps.coords.latitude, lng: locationGps.coords.longitude });
        setTimeout(() => {
            setCurrentLocation(null);
        }, 3000);
    }, [currentLocation, currentZoomLevel]);

    useLayoutEffect(() => {
        navigation.setOptions(
            {
                headerRight: ({ tintColor }) => (
                    <>
                        <IconButton
                            icon="list"
                            size={28}
                            color={tintColor}
                            onPress={() => navigation.navigate('AllPlaces')}
                        />
                        <IconButton
                            icon="location"
                            size={28}
                            color={tintColor}
                            onPress={getLocationHandler}
                        />
                        <IconButton
                            icon="reload"
                            size={28}
                            color={tintColor}
                            onPress={moveMap.bind(this, region.longitude, region.latitude, region.zoomLevel)}
                        />
                        <IconButton
                            icon="information"
                            size={28}
                            color={tintColor}
                            onPress={() => navigation.navigate('Info')}
                        />
                    </>
                ),
            });
    }, [navigation]);


    return (
        <View style={styles.container}>
            {isOffline && (<View style={styles.fallbackContainer}><Text style={styles.fallbackText}>Ni internetne povezave! Zemljevida ni mogoče prikazati!</Text></View>)}
            {isLoading && !isOffline && (<View style={styles.banner}><ActivityIndicator size="large" color="#0000ff" /></View>)}
            {!isOffline && (
                <MapLibreGL.MapView
                    style={styles.map}
                    logoEnabled={false}
                    attributionEnabled={true}
                    attributionPosition={attributionPosition}
                    styleURL="mapbox://styles/miro-sodja/clfwhbge3009401mztl3f09x4"
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
                    {currentLocation && (
                        <MapLibreGL.PointAnnotation id="2" coordinate={[currentLocation.lng, currentLocation.lat]} />
                    )}
                </MapLibreGL.MapView>
            )}
        </View>
    );
}

export default MapHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary100,
    },
    map: {
        flex: 1,
    },
    list: {
        margin: 24,
    },
    fallbackContainer: {
        flex: 1,
        flexDirection: 'column',
        margin: 12,
        verticalAlign: 'center',
        justifyContent: 'center',
    },
    fallbackText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.alert,
        textAlign: 'center',
        marginBottom: 12,
    },
    banner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.primary50,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
});
