import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const FarmerEditProfile = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        farmLocation: '',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter(); // Initialize the router


    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Error', 'You are not logged in.');
                return;
            }

            const response = await fetch('https://farmer-market-33zm.onrender.com/farmer/profile/', {
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setProfile({
                    fullName: data.farmer.name || '',
                    email: data.farmer.contact_info?.split('Email: ')[1]?.split(',')[0] || '',
                    phoneNumber: data.farmer.contact_info?.split('Phone: ')[1]?.split(',')[0] || '',
                    farmLocation: data.farm.name || '',
                });
            } else {
                Alert.alert('Error', data.message || 'Failed to load profile.');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Error', 'An error occurred while fetching profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Error', 'You are not logged in.');
                return;
            }

            const response = await fetch('https://farmer-market-33zm.onrender.com/farmer/profile/', {
                method: 'PATCH',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: profile.fullName,
                    location: profile.farmLocation,
                    contact_info: `Phone: ${profile.phoneNumber}, Email: ${profile.email}`,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully!');
                router.push('/farmer/FarmerProfileStart'); // Navigate to FarmerProfileStart page
            } else {
                Alert.alert('Error', data.message || 'Failed to save profile.');
            }
            console.log('Response status:', response.status);
            console.log('Response data:', data);

        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'An error occurred while saving profile data.');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (key, value) => {
        setProfile((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <ImageBackground
            style={styles.imgBackground}
            resizeMode="cover"
            source={require('../assets/images/profile.jpg')}
        >
            <ScrollView contentContainerStyle={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#3aaa58" />
                ) : (
                    <>
                        <View style={styles.profileSection}>
                            <Image
                                style={styles.profileImage}
                            />
                            <Text style={styles.profileName}>Edit Profile</Text>
                        </View>

                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.fullName}
                                onChangeText={(text) => handleInputChange('fullName', text)}
                            />

                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.phoneNumber}
                                onChangeText={(text) => handleInputChange('phoneNumber', text)}
                                keyboardType="phone-pad"
                            />
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                            />

                            <Text style={styles.inputLabel}>Farm Location</Text>
                            <TextInput
                                style={styles.input}
                                value={profile.farmLocation}
                                onChangeText={(text) => handleInputChange('farmLocation', text)}
                            />
                        </View>

                        {/* Save Profile Button */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                            <Text style={styles.saveButtonText}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
    },
    imgBackground: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 40,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: '#ccc',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputSection: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        borderRadius: 10,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#9796a1',
        margin: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        marginBottom: 16,
        borderColor: '#ccc',
    },
    saveButton: {
        backgroundColor: '#3aaa58',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default FarmerEditProfile;
