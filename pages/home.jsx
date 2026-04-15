import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-ui-lib';

const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Home;
