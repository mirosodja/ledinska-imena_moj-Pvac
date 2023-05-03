import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../constants/colors';

function PlaceItem({ place, onSelect }) {
    return (
        <Pressable
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            onPress={onSelect.bind(this, place.id)
            }
        >
            <Image style={styles.image} source={{ uri: place.imageUri }} />
            <View style={styles.info}>
                <Text style={styles.title}>{place.title}</Text>
                <Text style={styles.address}>{place.address}</Text>
                <View style={styles.ledinskoContainer}>
                    <Text style={styles.ledinskoLabel}>Po domače: </Text>
                    <Text style={styles.ledinskoIme}>{place.ledinskoIme}</Text>
                </View>
            </View>
        </Pressable>
    );
}

export default PlaceItem;

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 6,
        marginVertical: 12,
        backgroundColor: Colors.primary500,
        shadowColor: 'black',
        elevation: 2,
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
    },
    pressed: {
        opacity: 0.9,
    },
    image: {
        flex: 1,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        height: 100,
    },
    info: {
        flex: 2,
        padding: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.gray700,
    },
    address: {
        fontSize: 12,
        color: Colors.gray700,
    },
    ledinskoContainer: {
        flex: 2,
        flexDirection: 'row',
        paddingRight: 12,
    },
    ledinskoLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        color: Colors.gray700,
    },
    ledinskoIme: {
        fontSize: 14,
        color: Colors.gray700,
    },
});