import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ImageBackground 
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

// Reusable InputField component
const InputField = ({ placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default', style }) => (
  <TextInput
    style={[styles.input, style]}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
  />
);

export default function RegisterBuyer() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    contactNumber: '',
    email: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateFields = () => {
    const { deliveryAddress, contactNumber, email, password } = formData;

    if (!deliveryAddress.trim()) return 'Delivery Address is required.';
    if (!contactNumber.trim() || !/^\d+$/.test(contactNumber))
      return 'Valid Phone Number is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Valid Email is required.';
    if (!password.trim() || password.length < 6)
      return 'Password must be at least 6 characters long.';

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateFields();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    const payload = {
      user: {
        username: formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
      },
      delivery_address: formData.deliveryAddress,
      contact_number: formData.contactNumber,
    };

    try {
      const response = await axios.post(
        'https://farmer-market-33zm.onrender.com/users/register/buyer/',
        payload
      );
      if (response.status === 201) {
        Alert.alert('Success', 'Buyer registration successful! Please log in.');
        router.push('/authentification/login');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
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
          <Text style={styles.header}>Register as Buyer</Text>

          <InputField
            placeholder="Delivery Address"
            value={formData.deliveryAddress}
            onChangeText={(value) => handleInputChange('deliveryAddress', value)}
            style={styles.addressInput}
          />
          <InputField
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={formData.contactNumber}
            onChangeText={(value) => handleInputChange('contactNumber', value)}
            style={styles.numberInput}
          />
          <InputField
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            style={styles.emailInput}
          />
          <InputField
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            style={styles.passwordInput}
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
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBackground: {
    flex: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fe724c',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addressInput: {
    borderColor: '#264653',
  },
  numberInput: {
    borderColor: '#f97d5e',
  },
  emailInput: {
    borderColor: '#2f86ef',
  },
  passwordInput: {
    borderColor: '#2a9d8f',
  },
  submitButton: {
    backgroundColor: '#f97d5e',
    paddingVertical: 15,
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#f97d5e',
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
