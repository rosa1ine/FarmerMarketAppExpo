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
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FarmerNavBar from './FarmerNavBar';

const FarmerProfileStart = () => {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null); // Store the farmer's profile data
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    Alert.alert('Error', 'You are not logged in.');
                    router.replace('/login'); // Redirect to login if token is missing
                    return;
                }

                const response = await fetch('https://farmer-market-33zm.onrender.com/farmer/profile/', {
                    method: 'GET',
                    headers: {
                        Authorization: `Token ${token}`, // Add token to headers
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setProfileData(data.farmer); // Set the farmer's data

                    // Extract email and phone from contact_info
                    const contactInfo = data.farmer.contact_info || '';
                    const emailMatch = contactInfo.match(/Email: ([^,]+)/i);
                    const phoneMatch = contactInfo.match(/Phone: ([^,]+)/i);
                    setEmail(emailMatch ? emailMatch[1].trim() : '');
                    setPhone(phoneMatch ? phoneMatch[1].trim() : '');
                } else {
                    Alert.alert('Error', data.message || 'Failed to fetch profile.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                Alert.alert('Error', 'An error occurred while fetching profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#3aaa58" style={{ flex: 1 }} />;
    }

    if (!profileData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error loading profile data.</Text>
            </View>
        );
    }
    return (
        <ImageBackground
            style={styles.imgBackground}
            resizeMode="cover"
            source={require('../assets/images/profile.jpg')}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileSection}>
                    <Image
                        style={styles.profileImage}
                        source={require('../assets/images/avatar1.png')}
                    />
                    <Text style={styles.profileName}>{profileData.name}</Text>
                </View>

                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                        style={[styles.input, { borderColor: '#FF6347' }]}
                        value={profileData.name}
                        editable={false}
                    />

                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, { borderColor: '#1E90FF' }]}
                        value={phone}
                        editable={false}
                    />

                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={[styles.input, { borderColor: '#32CD32' }]}
                        value={email}
                        editable={false}
                    />

                    <Text style={styles.inputLabel}>Farm Location</Text>
                    <TextInput
                        style={[styles.input, { borderColor: '#FFD700' }]}
                        value={profileData.location}
                        editable={false}
                    />
                </View>

                {/* Edit Profile Button */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push('/farmer/FarmerEditProfile')}
                >
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        <FarmerNavBar/>
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
    },
    editButton: {
        backgroundColor: '#3aaa58',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#f97d5e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default FarmerProfileStart;
