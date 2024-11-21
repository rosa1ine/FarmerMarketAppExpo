import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();
  const [userType, setUserType] = useState('');

  const handleRegister = (type) => {
    if (type === 'farmer') {
      router.push('/authentification/registerFarmer'); // Navigate to Farmer registration page
    } else if (type === 'buyer') {
      router.push('/authentification/registerBuyer'); // Navigate to Buyer registration page
    }
  };

  return (
    <View style={styles.container}>
      {/* Farmer Registration Block */}
      <TouchableOpacity
        style={styles.farmerBlock}
        onPress={() => handleRegister('farmer')}
      >
        <Image
          source={require('../assets/images/farmer-bg.jpg')} 
          style={styles.backgroundImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.blockTitle}>Register as Farmer</Text>
        </View>
      </TouchableOpacity>

      {/* Buyer Registration Block */}
      <TouchableOpacity
        style={styles.buyerBlock}
        onPress={() => handleRegister('buyer')}
      >
        <Image
          source={require('../assets/images/buyer-bg.jpg')} 
          style={styles.backgroundImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.blockTitle}>Register as Buyer</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  farmerBlock: {
    flex: 1,
    position: 'relative',
  },
  buyerBlock: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent overlay
  },
  blockTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
});
