import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import MapLibreGL from "@maplibre/maplibre-react-native";
import NetInfo from "@react-native-community/netinfo";

import IconButton from "../UI/IconButton";
import { Colors } from "../../constants/colors";
import { getRegion, storeRegion } from "../../util/database";
import { mapboxToken } from "../../mapbox/mapboxtoken";

MapLibreGL.setAccessToken(mapboxToken);

const DEFAULT_HOME_REGION = {
  latitude: 46.35528,
  longitude: 14.18808,
  zoomLevel: 8.1,
};

function SharedMapScreen({ navigation, route, variant }) {
  const initialLocation = route?.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
    zoomLevel: route.params.initialZoomLevel,
  };
  const shouldShowPickerActions = !route?.params || route.params.showHeaderButton;
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setOfflineStatus] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({});
  const currentZoomLevel = useRef(initialLocation ? initialLocation.zoomLevel : DEFAULT_HOME_REGION.zoomLevel);
  const attributionPosition = useMemo(() => ({ top: 8, left: 8 }), []);
  const cameraRef = useRef(null);
  const mapRef = useRef(null);

  const region = useMemo(() => {
    if (variant === "picker" && initialLocation) {
      return {
        latitude: initialLocation.lat,
        longitude: initialLocation.lng,
        zoomLevel: initialLocation.zoomLevel,
      };
    }

    return {
      latitude: currentRegion.latitude ?? DEFAULT_HOME_REGION.latitude,
      longitude: currentRegion.longitude ?? DEFAULT_HOME_REGION.longitude,
      zoomLevel: currentRegion.zoomLevel ?? DEFAULT_HOME_REGION.zoomLevel,
    };
  }, [currentRegion, initialLocation, variant]);

  useEffect(() => {
    const fetchRegion = async () => {
      const regionData = await getRegion();
      if (regionData) {
        setCurrentRegion(regionData);
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

  const moveMap = useCallback((longitude, latitude, zoomLevel) => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel,
        animationDuration: 2000,
      });
    }
  }, []);

  const handleRegionDidChange = useCallback(async () => {
    if (mapRef.current) {
      currentZoomLevel.current = await mapRef.current.getZoom();
      const center = await mapRef.current.getCenter();

      if (variant === "home" || !initialLocation) {
        const regionForStore = {
          latitude: center[1],
          longitude: center[0],
          zoomLevel: currentZoomLevel.current,
        };
        await storeRegion(regionForStore);
      }
    }

    setIsLoading(false);
  }, [initialLocation, variant]);

  const selectLocationHandler = useCallback(
    (event) => {
      if (variant !== "picker") {
        return;
      }

      const lat = event.geometry.coordinates[1];
      const lng = event.geometry.coordinates[0];
      setSelectedLocation({ lat, lng, zoomLevel: currentZoomLevel.current });
    },
    [variant]
  );

  const getLocationHandler = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Premalo dovoljenj!",
        "Aplikaciji morate v Nastavitvah omogočiti dostop do lokacije na napravi.",
        [{ text: "V redu" }]
      );
      return;
    }

    setIsLoading(true);
    const locationGps = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

    if (variant === "home" && mapRef.current) {
      let adjustedZoomLevel = await mapRef.current.getZoom();
      if (adjustedZoomLevel < 15.1) {
        adjustedZoomLevel = (16 + adjustedZoomLevel) / 2;
      }

      moveMap(locationGps.coords.longitude, locationGps.coords.latitude, adjustedZoomLevel);
      setCurrentLocation({ lat: locationGps.coords.latitude, lng: locationGps.coords.longitude });
      setTimeout(() => {
        setCurrentLocation(null);
      }, 3500);
      return;
    }

    setCurrentLocation({ lat: locationGps.coords.latitude, lng: locationGps.coords.longitude });
    setTimeout(() => {
      setCurrentLocation(null);
    }, 3000);

    if (cameraRef.current) {
      cameraRef.current.flyTo([locationGps.coords.longitude, locationGps.coords.latitude], 2000);
    }
  }, [moveMap, variant]);

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert("Niste izbrali Pváca!", "Pvác izberete tako, da tapnete na zemljevid!");
      return;
    }

    navigation.navigate("AddPlace", {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
      pickedZoomLevel: currentZoomLevel.current,
    });
  }, [navigation, selectedLocation]);

  useLayoutEffect(() => {
    if (variant === "picker") {
      if (!shouldShowPickerActions) {
        return;
      }

      navigation.setOptions({
        headerRight: ({ tintColor }) => (
          <>
            <IconButton icon="save" size={28} color={tintColor} onPress={savePickedLocationHandler} />
            <IconButton icon="location" size={28} color={tintColor} onPress={getLocationHandler} />
          </>
        ),
      });
      return;
    }

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <>
          <IconButton
            icon="list"
            size={28}
            color={tintColor}
            onPress={() => navigation.navigate("AllPlaces")}
          />
          <IconButton icon="location" size={28} color={tintColor} onPress={getLocationHandler} />
          <IconButton
            icon="reload"
            size={28}
            color={tintColor}
            onPress={() =>
              moveMap(
                DEFAULT_HOME_REGION.longitude,
                DEFAULT_HOME_REGION.latitude,
                DEFAULT_HOME_REGION.zoomLevel
              )
            }
          />
          <IconButton
            icon="information"
            size={28}
            color={tintColor}
            onPress={() => navigation.navigate("Info")}
          />
        </>
      ),
    });
  }, [
    getLocationHandler,
    moveMap,
    navigation,
    savePickedLocationHandler,
    shouldShowPickerActions,
    variant,
  ]);

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>Ni internetne povezave! Zemljevida ni mogoče prikazati!</Text>
        </View>
      )}
      {isLoading && !isOffline && (
        <View style={styles.banner}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {!isOffline && (
        <MapLibreGL.MapView
          style={styles.map}
          logoEnabled={false}
          attributionEnabled
          attributionPosition={attributionPosition}
          styleURL="mapbox://styles/miro-sodja/clfwhbge3009401mztl3f09x4"
          onPress={variant === "picker" ? selectLocationHandler : undefined}
          onRegionDidChange={handleRegionDidChange}
          projectionMode="mercator"
          ref={mapRef}
        >
          <MapLibreGL.Camera
            defaultSettings={{
              centerCoordinate: [region.longitude, region.latitude],
              zoomLevel: region.zoomLevel,
            }}
            ref={cameraRef}
          />
          {variant === "picker" && selectedLocation && (
            <MapLibreGL.PointAnnotation id="1" coordinate={[selectedLocation.lng, selectedLocation.lat]} />
          )}
          {currentLocation && (
            <MapLibreGL.PointAnnotation id="2" coordinate={[currentLocation.lng, currentLocation.lat]} />
          )}
        </MapLibreGL.MapView>
      )}
    </View>
  );
}

export default SharedMapScreen;

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
    flexDirection: "column",
    margin: 12,
    verticalAlign: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.alert,
    textAlign: "center",
    marginBottom: 12,
  },
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});
