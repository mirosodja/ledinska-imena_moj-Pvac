import { useLayoutEffect, useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Alert, StyleSheet, ActivityIndicator, Text, View } from "react-native";
import * as Location from 'expo-location';
import MapLibreGL from '@maplibre/maplibre-react-native';
import NetInfo from "@react-native-community/netinfo";
import { Colors } from "../constants/colors";
import IconButton from "../components/UI/IconButton";
import { getRegion, storeRegion } from "../util/database";

// set MapLibreGL to mapbox tile server
//TODO comment this line when you build the app with eas
import { mapboxToken } from "../mapbox/mapboxtoken";
// Removed unused import of 'get' to fix the compile error
//TODO uncomment this line when you build the app with eas
// import Constants from 'expo-constants';
// const mapboxToken = Constants.manifest.extra.mapboxToken;
MapLibreGL.setAccessToken(mapboxToken);


function MapHome({ navigation }) {

    const [currentLocation, setCurrentLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setOfflineStatus] = useState(false);
    const [currentRegion, setRegion] = useState({});

    const cameraRef = useRef(null);
    const mapRef = useRef(null);
    const attributionPosition = useMemo(() => ({ top: 8, left: 8 }), []);

    useEffect(() => {
        const fetchRegion = async () => {
            const regionData = await getRegion();
            if (regionData) {
                setRegion(regionData);
            }
        };
        fetchRegion();
    }, []);

    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        return () => removeNetInfoSubscription();
    }, []);

    const moveMap = (longitude, latitude, zoomLevel) => {
        if (cameraRef.current) {
            setIsLoading(true);
            cameraRef.current.setCamera({
                centerCoordinate: [longitude, latitude],
                zoomLevel: zoomLevel,
                animationDuration: 2000,
            });
        }
    }

    const handleRegionDidChange = async () => {
        if (mapRef.current) {
            const currentZoom = await mapRef.current.getZoom();
            const center = await mapRef.current.getCenter();
            const currentRegion = {
                latitude: center[1],
                longitude: center[0],
                zoomLevel: currentZoom,
            };
            await storeRegion(currentRegion);
        }
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
        let adjustedZoomLevel = await mapRef.current.getZoom();
        if (adjustedZoomLevel < 15.1) {
            adjustedZoomLevel = (16 + adjustedZoomLevel) / 2;
        }
        moveMap(locationGps.coords.longitude, locationGps.coords.latitude, adjustedZoomLevel);
        setCurrentLocation({ lat: locationGps.coords.latitude, lng: locationGps.coords.longitude });
        setTimeout(() => {
            setCurrentLocation(null);
        }, 3500);
    }, [currentLocation,]);

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
                            onPress={moveMap.bind(this, 14.188080, 46.355280, 8.1)}
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
                    ref={mapRef}
                >
                    <MapLibreGL.Camera
                        defaultSettings={{
                            centerCoordinate: [currentRegion.longitude, currentRegion.latitude],
                            zoomLevel: currentRegion.zoomLevel,
                        }}
                        ref={cameraRef}
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
