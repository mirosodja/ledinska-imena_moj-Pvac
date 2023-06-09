import { Alert, View, Text, Image, StyleSheet } from "react-native";
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlinedButton from '../UI/OutlinedButton';

function ImagePicker({ onTakeImage }) {
    const [pickedImage, setPickedImage] = useState();
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

    async function verifyPermission() {
        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert('Premalo dovoljenj!',
                'Aplikaciji morate v Nastavitvah omogočiti dostop do fotografij in kamere na napravi.');
            return false;
        }

        return true;
    }

    async function takeImageHandler() {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
            return;
        }

        const image = await launchCameraAsync(
            {
                mediaTypes: 'Images',
                allowEditing: false,
                aspect: [3, 4],
                quality: 0.5,
                base64: true,
                allowsMultipleSelection: false,
            }
        );
        if (!image.canceled) {
            setPickedImage(image.assets[0].uri);
            onTakeImage(image.assets[0].uri);
        }
    }

    let imagePreview = <Text>Slika s Pváca</Text>;
    if (pickedImage) {
        imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
    }

    return (
        <View>
            <View style={styles.imagePreview}>
                {imagePreview}
            </View>
            <View style={styles.actions}>
                <OutlinedButton icon="camera" onPress={takeImageHandler}>Slikaj Pvác</OutlinedButton>
            </View>
        </View>);

}

export default ImagePicker;

const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 10,
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
    },
});