import { View, Text, StyleSheet } from 'react-native';

export default function SavedColorsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Saved Colors</Text>
            <Text style={styles.sub}>Your saved colors will appear here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    text: { fontSize: 24, fontWeight: 'bold' },
    sub: { fontSize: 14, color: '#888', marginTop: 8 },
});