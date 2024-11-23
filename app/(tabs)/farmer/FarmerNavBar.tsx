import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const FarmerNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.push('/farmer')}>
        <Text style={styles.navItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/farmer/FarmerProfileStart')}>
        <Text style={styles.navItem}>Profile</Text>
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FarmerNavBar;
