import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F2F2',
    },
    logoContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: width * 1,
        height: width * 1,
    },
    formContainer: {
        flex: 0.7,
        paddingHorizontal: 20,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2B2A2A',
        marginTop: -30,
        marginBottom: 10,
        textAlign: 'center',
    },
});