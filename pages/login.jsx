import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextField, Button, ThemeManager, Colors } from 'react-native-ui-lib';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../contexts/AuthContext';
import { Logo } from '../assets/svgs';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn, setUserDetails } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const res = await auth().signInWithEmailAndPassword(email, password);
            setUserDetails(res.user);
            setIsLoggedIn(true);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Logo style={styles.logo} />
                <View style={styles.nameContainer}>
                    <Text style={styles.title} h1>Beaver</Text>
                    <Text style={styles.title} h1>Events</Text>
                </View>
            </View>
            <TextField
                placeholder="Email"
                floatingPlaceholder
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />
            <TextField
                placeholder="Password"
                floatingPlaceholder
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button label="Login" onPress={handleLogin} />
            <Button label="Sign Up" style={{ backgroundColor: Colors.$backgroundNeutralIdle }} onPress={() => { navigation.navigate("Signup") }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: 'center',
        paddingTop: 80,
        height: "100%",
        gap: 10
    },
    logoContainer: {
        width: "90%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    nameContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    logo: {
        height: "100%",
        width: "160px",
    },
    input: {
        borderBottomColor: Colors.grey10,
        borderBottomWidth: 2,
        width: 200,
        height: 40,
    }
});

export default Login;
