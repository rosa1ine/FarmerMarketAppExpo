import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

const FarmerNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.push('/farmer')} style={styles.navItem}>
        <FontAwesome name="home" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/farmer/FarmerProfileStart')} style={styles.navItem}>
        <FontAwesome name="user" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3aaa58',
    paddingVertical: 20,
    borderRadius: 30,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  icon: {
    marginBottom: 5,
  },
});

export default FarmerNavBar;
