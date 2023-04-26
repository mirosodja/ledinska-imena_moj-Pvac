import { useEffect, useState } from 'react';
import { Alert, ScrollView, Image, View, Text, StyleSheet } from 'react-native';

import OutlinedButton from '../components/UI/OutlinedButton';
import { Colors } from '../constants/colors';
import { fetchPlaceDetails, deletePlace } from '../util/database';

function PlaceDetails({ route, navigation }) {
    const [fetchedPlace, setFetchedPlace] = useState();

    function showOnMapHandler() {
        navigation.navigate('Map', {
            initialLat: fetchedPlace.location.lat,
            initialLng: fetchedPlace.location.lng,
        });
    }

    const selectedPlaceId = route.params.placeId;

    useEffect(() => {
        async function loadPlaceData() {
            const place = await fetchPlaceDetails(selectedPlaceId);
            setFetchedPlace(place);
            navigation.setOptions({
                title: place.title,
            });
        }

        loadPlaceData();
    }, [selectedPlaceId]);

    if (!fetchedPlace) {
        return (
            <View style={styles.fallback}>
                <Text>Nalagam Pvác...</Text>
            </View>
        );
    }

    function deletePlaceHandler() {
        Alert.alert(
            'Izbriši zapis',
            'Potrdite izbris zapisa?',
            [
                {
                    text: 'Prekliči',
                    style: 'cancel',
                },
                {
                    text: 'Potrdi',
                    onPress: () => {
                        deletePlace(selectedPlaceId)
                            .then(() => {
                                Alert.alert('Izbrisano', 'Zapis je izbrisan.');
                            })
                            .catch((error) => {
                                Alert.alert('Napaka', `Napaka pri brisanju: ${error.message}`);
                            });
                    },
                },
            ],
            { cancelable: false },
        );
    }

    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
            <View style={styles.locationContainer}>
                <View style={styles.addressContainer}>
                    <Text style={styles.address}>{fetchedPlace.address}</Text>
                </View>
                <OutlinedButton icon="map" onPress={showOnMapHandler}>
                    Pvác na mapi
                </OutlinedButton>
                <OutlinedButton icon="trash" onPress={deletePlaceHandler}>
                    Izbriši
                </OutlinedButton>
            </View>
        </ScrollView>
    );
}

export default PlaceDetails;

const styles = StyleSheet.create({
    fallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: '35%',
        minHeight: 300,
        width: '100%',
    },
    locationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressContainer: {
        padding: 20,
    },
    address: {
        color: Colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
