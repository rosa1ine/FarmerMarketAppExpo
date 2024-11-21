import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function RegisterFarmer() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (!name || !location || !contactInfo || !email || !password) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    const payload = {
      name,
      location,
      contact_info: contactInfo,
      user: {
        username: email.split('@')[0],
        email,
        password,
      },
    };

    try {
      const response = await axios.post(
        'https://farmer-market-33zm.onrender.com/users/register/farmer/',
        payload
      );
      if (response.status === 201) {
        Alert.alert('Success', 'Farmer registration successful! Please log in.');
        router.push('/authentification/login'); // Navigate to the login screen
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <ImageBackground
      style={styles.imgBackground}
      resizeMode="cover"
      source={require('../assets/images/background.jpg')}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Register as Farmer</Text>

          <TextInput 
            style={[styles.input, styles.nameInput]} 
            placeholder="Name" 
            value={name} 
            onChangeText={setName} 
          />

          <TextInput 
            style={[styles.input, styles.locationInput]} 
            placeholder="Location" 
            value={location} 
            onChangeText={setLocation} 
          />

          <TextInput 
            style={[styles.input, styles.contactInfoInput]} 
            placeholder="Contact Info" 
            value={contactInfo} 
            onChangeText={setContactInfo} 
          />

          <TextInput 
            style={[styles.input, styles.emailInput]} 
            placeholder="Email" 
            keyboardType="email-address" 
            value={email} 
            onChangeText={setEmail} 
          />

          <TextInput 
            style={[styles.input, styles.passwordInput]} 
            placeholder="Password" 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3aaa58',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 15,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  nameInput: {
    borderColor: '#264653',
  },
  locationInput: {
    borderColor: '#f97d5e',
  },
  contactInfoInput: {
    borderColor: '#3aaa58',
  },
  emailInput: {
    borderColor: '#2f86ef',
  },
  passwordInput: {
    borderColor: '#2a9d8f',
  },
  submitButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#3aaa58',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
