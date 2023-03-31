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
        console.log(imageUri);
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
            Alert.alert('Missing data', 'Please fill in all fields.', [{ text: 'OK' }]);
        }
    }
    // TODO 
    // => pazi, tu ni error handlerja, če niso vsi podatki izpolnjeni 
    // => prav tako je problem, ker, če pustiš prazno, pa si prej že vnesel, vrne napako, ker je id isti
    // TODO
    // => read location on load

    return (
        <ScrollView style={styles.form}>
            <View>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={changeTitleHandler}
                    value={enteredTitle}
                />
            </View>
            <ImagePicker onTakeImage={takeImageHandler} />
            <LocationPicker onPickLocation={pickLocationHandler} />
            <Button onPress={savePlaceHandler}>Add Place</Button>
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