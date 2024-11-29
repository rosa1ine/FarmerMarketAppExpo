import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(''); // 'farmer' or 'buyer'
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || !userType) {
      Alert.alert('Error', 'Please fill in all fields and select a user type.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        'https://farmer-market-33zm.onrender.com/users/login/',
        { username: email, password, user_type: userType } // Include user type
      );
  
      if (response.status === 200 && response.data.token) {
        const token = response.data.token;
  
        // Save the token locally
        await AsyncStorage.setItem('authToken', token);
  
        Alert.alert('Login Successful', `Welcome back, ${userType}!`);
  
        // Navigate based on user type
        if (userType === 'farmer') {
          router.push('/farmer');
        } else if (userType === 'buyer') {
          router.push('/buyer');
        }
      } else {
        Alert.alert('Error', response.data.message || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ImageBackground
      style={styles.imgBackground}
      resizeMode="cover"
      source={require('../assets/images/background.jpg')}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Login</Text>
          <Text style={styles.subheader}>Select User Type:</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              userType === 'farmer' ? styles.activeFarmerButton : styles.inactiveButton,
            ]}
            onPress={() => setUserType('farmer')}
          >
            <Text style={styles.buttonText}>Farmer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              userType === 'buyer' ? styles.activeBuyerButton : styles.inactiveButton,
            ]}
            onPress={() => setUserType('buyer')}
          >
            <Text style={styles.buttonText}>Buyer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <TextInput
            style={styles.inputEmail}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email Input"
            accessibilityHint="Enter your email address here"
          />
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password Input"
            accessibilityHint="Enter your password here"
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBackground: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3aaa58',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    color: '#264653',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 23,
    marginHorizontal: 7,
  },
  activeFarmerButton: {
    backgroundColor: '#3aaa58',
    elevation: 5,
    shadowColor: '#3aaa58',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  activeBuyerButton: {
    backgroundColor: '#fe724c',
    elevation: 5,
    shadowColor: '#f97d5e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  inactiveButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  formSection: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  inputEmail: {
    borderWidth: 1,
    borderColor: '#fe724c',
    borderRadius: 10,
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: '#3aaa58',
    borderRadius: 10,
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  loginButton: {
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
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
