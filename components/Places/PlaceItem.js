import { Pressable, View, StyleSheet } from "react-native";

function PlaceItem({ place, onSelect }) {
    return (
        <Pressable onPress={onSelect}><View>
            <Image source={{ uri: place.imageUri }} />
            <Text>{place.title}</Text>
            <Text>{place.address}</Text>
        </View>
        </Pressable>
    );
}

export default PlaceItem;

const styles = StyleSheet.create({});