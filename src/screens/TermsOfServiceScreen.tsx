import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authStyles } from '../styles/authStyles';

export default function TermsOfServiceScreen({ navigation }: any) {
    return (
        <SafeAreaView style={authStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={28} color="#2B2A2A" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: '#F5F2F2',
        justifyContent: 'center',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    backButton: {
        // Positioned inside the generic header layout
    },
});
