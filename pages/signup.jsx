import React, { useContext, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text, TextField, Button, Colors, Image, ActionSheet } from 'react-native-ui-lib';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import ImagePicker from "react-native-image-crop-picker";

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [contactFormattedNumber, setFormattedContactNumber] = useState('');
    const { setIsLoggedIn, setUserDetails } = useContext(AuthContext);
    const [errMsgs, setErrMsgs] = useState({});
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(true);
    const [profilePic, setProfilePic] = useState();

    const handleSignup = async () => {
        const validationSuccessful = validateFields()
        if (!validationSuccessful) return;

        try {
            // Creathing user auth for login
            const authRes = await auth().createUserWithEmailAndPassword(email, password);

            let uploadedProfilePic;
            if (profilePic) {
                // Uploading user profile pic to cloud storage
                const profilePicBucketRef = storage().ref(`profilePics/${authRes.user.uid}`);
                await profilePicBucketRef.putFile(profilePic.path);
                uploadedProfilePic = await profilePicBucketRef.getDownloadURL();
            }

            const userDetail = {
                fullName,
                email,
                contactNumber,
                authId: authRes.user.uid,
                profilePic: uploadedProfilePic
            }


            // Storing users info
            await firestore()
                .collection('Users')
                .add(userDetail)

            setUserDetails(userDetail);
            setIsLoggedIn(true);
        } catch (err) {
            console.log(err);
            if (err.message) {
                Alert.alert('Signup Error', err.message, [
                    { text: 'OK' },
                ]);
            }
        }
    };

    const handleContactNumberChange = (value) => {
        // Add formatting to the phone number as it's typed
        let formattedPhoneNumber = value.replace(/[^0-9]/g, '');
        if (formattedPhoneNumber.length > 3) {
            formattedPhoneNumber = `${formattedPhoneNumber.slice(0, 3)}-${formattedPhoneNumber.slice(3)}`;
        }
        if (formattedPhoneNumber.length > 7) {
            formattedPhoneNumber = `${formattedPhoneNumber.slice(0, 7)}-${formattedPhoneNumber.slice(7)}`;
        }
        setFormattedContactNumber(formattedPhoneNumber);
        setContactNumber(value)
    };

    const validateFields = () => {
        const errs = {};
        if (!fullName) {
            errs.fullName = "Full Name is required"
        } else if (fullName.length < 6) {
            errs.fullName = "Full Name must be 6 characters long"
        }

        if (!email) {
            errs.email = "Email is required"
        } else if (/\b[A-Z0-9._%+-]+@minotstateu\.com\b/i.test(email)) {
            errs.email = "Email is invalid";
        }

        if (!password) {
            errs.password = "Password is required"
        } else if (password.length < 6) {
            errs.password = "Password must be 6 characters long"
        }

        if (!confirmPassword) {
            errs.confirmPassword = "Password is required"
        } else if (confirmPassword !== password) {
            errs.confirmPassword = "Please make sure your passwords match"
        }

        setErrMsgs(errs);
        return Object.keys(errs).length === 0;
    }

    const selectProfilePicFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then((image) => {
            console.log(image);
            setProfilePic(image);
        });
    };

    const captureProfilePic = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then((image) => {
                setProfilePic(image);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <View style={styles.logoContainer}>
                <Logo style={styles.logo} />
                <View style={styles.nameContainer}>
                    <Text style={styles.title} h1>Beaver</Text>
                    <Text style={styles.title} h1>Events</Text>
                </View>
            </View> */}
            <ActionSheet
                visible={isBottomSheetVisible}
                // containerStyle={{
                //     backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
                // }}
                useNativeIOS={true}
                options={
                    [{
                        label: 'Open gallery', onPress: () => {
                            setIsBottomSheetVisible(false);
                            selectProfilePicFromGallery();
                        }
                    },
                    {
                        label: 'Open camera',
                        onPress: () => {
                            setIsBottomSheetVisible(false);
                            captureProfilePic();
                        }
                    },
                    { label: 'Cancel', onPress: () => setIsBottomSheetVisible(false) }
                    ]
                }
                onDismiss={() => setIsBottomSheetVisible(false)}
                onModalDismissed={() => setIsBottomSheetVisible(false)}
                cancelButtonIndex={2}
            />

            <View style={styles.ProfilePicView}>
                <TouchableOpacity
                    onPress={() => setIsBottomSheetVisible(true)}
                    style={styles.ProfilePicSelector}>
                    {profilePic ? (
                        <Image
                            source={{ uri: profilePic.path }}
                            style={styles.ProfilePic}
                        />
                    ) : (
                        <Image
                            source={require('../assets/icons/person.png')}
                            style={styles.ProfilePic}
                        />
                    )}
                </TouchableOpacity>
            </View>
            <TextField
                placeholder="Full Name"
                floatingPlaceholder
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                enableErrors
                validationMessage={errMsgs.fullName}
            />
            <TextField
                placeholder="Email"
                floatingPlaceholder
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                enableErrors
                validationMessage={errMsgs.email}
            />
            <TextField
                placeholder="Contact No."
                floatingPlaceholder
                value={contactFormattedNumber}
                enableErrors
                onChangeText={handleContactNumberChange}
                keyboardType="phone-pad"
                style={styles.input}
            />
            <TextField
                placeholder="Password"
                floatingPlaceholder
                value={password}
                onChangeText={setPassword}
                enableErrors
                validationMessage={errMsgs.password}
                secureTextEntry
                style={styles.input}
            />
            <TextField
                placeholder="Confirm Password"
                floatingPlaceholder
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                enableErrors
                validationMessage={errMsgs.confirmPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button label="Sign Up" onPress={handleSignup} />
            <Button label="Login" onPress={() => { navigation.navigate('Login') }} style={{ backgroundColor: Colors.$backgroundNeutralIdle }} />
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 10
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
        width: 250,
        height: 40,
    },
    ProfilePicView: {
        margin: 10,
    },

    ProfilePicSelector: {
        height: 100,
        width: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.grey50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        overflow: 'hidden',
        elevation: 4,
    },

    ProfilePic: {
        height: "80%",
        width: "80%",
    },

});

export default SignUp;
