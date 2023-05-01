import { Pressable, StyleSheet, Text } from "react-native";

import { Colors } from "../../constants/colors";

function Button({ onPress, children }) {
    return (
        <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={onPress}
        >
            <Text style={styles.text}>{children}</Text>
        </Pressable>
    );
}

export default Button;

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 4,
        backgroundColor: Colors.primary700,
        elevation: 4,
        shadowColor: Colors.primary800,
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 2 },
        shadowRadius: 3,
        borderRadius: 6,
    },
    pressed: {
        opacity: 0.7,
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.primary50,
    },
});
