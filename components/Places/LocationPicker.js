import { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import {
    useNavigation,
    useRoute,
    useIsFocused
} from "@react-navigation/native";

import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";
import { getAddress, getMapPreview, getLedinskoIme } from '../../util/location';
import AsyncImage from "../UI/AsyncImage";

function LocationPicker({ onPickLocation }) {
    const [pickedLocation, setPickedLocation] = useState();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        if (isFocused && route.params) {
            const mapPickedLocation = {
                lat: route.params.pickedLat,
                lng: route.params.pickedLng,
                zoomLevel: route.params.pickedZoomLevel,
            };
            setPickedLocation(mapPickedLocation);
        }
    }, [route, isFocused]);

    useEffect(() => {
        async function handleLocation() {
            if (pickedLocation) {
                //TODO: change in case of internationalization
                const currentDate = new Date();
                // format date to day., dd.mm.yyyy hh:mm
                const date = currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.' + currentDate.getFullYear() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes().toString().padStart(2, '0');
                const address = await getAddress(pickedLocation.lat, pickedLocation.lng);
                const ledinskoIme = await getLedinskoIme(pickedLocation.lat, pickedLocation.lng);
                onPickLocation({ ...pickedLocation, address, ledinskoIme, date });
            }
        }
        handleLocation();
    }, [pickedLocation, onPickLocation]);

    function pickOnMapHandler() {
        navigation.navigate('Map', pickedLocation ? {
            initialLat: pickedLocation.lat,
            initialLng: pickedLocation.lng,
            initialZoomLevel: pickedLocation.zoomLevel,
            showHeaderButton: true
        } : undefined);
    }

    let locationPreview = <Text>Dodajte Pvác.</Text>;


    if (pickedLocation) {
        locationPreview = (
            <AsyncImage
                style={styles.image}
                source={{
                    uri: getMapPreview(pickedLocation.lat, pickedLocation.lng, pickedLocation.zoomLevel),
                }}
                placeholderSource={require('../../assets/loading.gif')}
                loaded={false}
            />
        );
    }

    return (
        <View>
            <View style={styles.mapPreview}>
                {locationPreview}</View>
            <View style={styles.actions}>
                <OutlinedButton icon="map" onPress={pickOnMapHandler}>
                    Izberi Pvác
                </OutlinedButton>
            </View>
        </View>
    );
}

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4
    },
});
