import { View, Text, StyleSheet } from 'react-native';

function Help() {
    return (
        <View style={styles.help}>
            <Text>Help</Text>
        </View>
    );
}

export default Help;

const styles = StyleSheet.create({
    help: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});