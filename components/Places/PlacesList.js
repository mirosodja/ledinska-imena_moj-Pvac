import { View, FlatList, Text, StyleSheet } from "react-native";
import PlaceItem from "./PlaceItem";
import { Colors } from "../../constants/colors";

function PlacesList({ places }) {
    if (!places || places.length === 0) {
        return (<View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>Nobene priljubljene točke ni. Mogoče bi kakšno dodali?</Text>
        </View>);
    }

    return (<FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlaceItem place={item} />}
    />
    );
}

export default PlacesList;

const styles = StyleSheet.create({
    fallbackContainer: {
        flex: 1,
        jsutifyContent: 'center',
        alignItems: 'center',
    },
    fallbackText: {
        fontSize: 16,
        textColors: Colors.primary500,
    },
});