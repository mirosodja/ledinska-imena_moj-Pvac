import { useState, useCallback } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Alert } from 'react-native';

import { Colors } from '../../constants/colors.js';
import { Place } from '../../models/place.js';
import ImagePicker from './ImagePicker.js';
import LocationPicker from './LocationPicker.js';
import Button from '../UI/Button.js';

function PlaceForm({ onCreatePlace }) {

    const [enteredTitle, setEnteredTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState();
    const [pickedLocation, setPickedLocation] = useState();

    function changeTitleHandler(enteredText) {
        setEnteredTitle(enteredText);
    }

    function takeImageHandler(imageUri) {
        setSelectedImage(imageUri);
    }

    const pickLocationHandler = useCallback((location) => {
        setPickedLocation(location);
    }, []);

    function savePlaceHandler() {
        if (enteredTitle && selectedImage && pickedLocation) {
            const placeData = new Place(enteredTitle, selectedImage, pickedLocation);
            onCreatePlace(placeData);
        }
        else {
            Alert.alert('Premalo podatkov', 'Vsa polja morajo biti izpolnjena.', [{ text: 'V redu' }]);
        }
    }
    // TODO
    // => read location on load

    return (
        <ScrollView style={styles.form}>
            <View>
                <Text style={styles.label}>Vzdevek</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={changeTitleHandler}
                    value={enteredTitle}
                />
            </View>
            <ImagePicker onTakeImage={takeImageHandler} />
            <LocationPicker onPickLocation={pickLocationHandler} />
            <Button onPress={savePlaceHandler}>Dodaj Pvác</Button>
        </ScrollView>
    );
}

export default PlaceForm;

const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 24,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.primary500,
    },
    input: {
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        fontSize: 16,
        borderBottomColor: Colors.primary700,
        borderBottomWidth: 2,
        backgroundColor: Colors.primary100,
    },
});