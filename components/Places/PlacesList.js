import { View, FlatList, Text, StyleSheet, Dimens } from "react-native";
import PlaceItem from "./PlaceItem";
import { Colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

function PlacesList({ places }) {
    const navigation = useNavigation();

    function selectPlaceHandler(id) {
        navigation.navigate('PlaceDetails', {
            placeId: id
        });
    }

    if (!places || places.length === 0) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>
                    V 'Moj Pvác' lahko obiskan kraj z ledinskim imenom dodaste v seznam tako, da tapnete na plus v naslovni vrstici.
                </Text>
            </View>);
    }

    return (<FlatList style={styles.list}
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlaceItem place={item} onSelect={selectPlaceHandler} />}
    />
    );
}

export default PlacesList;

const styles = StyleSheet.create({
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
        color: Colors.primary50,
        textAlign: 'left',
        marginBottom: 12,
    },
});