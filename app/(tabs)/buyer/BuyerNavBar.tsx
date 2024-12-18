
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

const BuyerNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.push('/buyer')} style={styles.navItem}>
        <FontAwesome name="home" size={24} color="#3aaa58" style={styles.icon} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/buyer/BuyerCart')} style={styles.navItem}>
        <FontAwesome name="shopping-cart" size={24} color="#3aaa58" style={styles.icon} />
        <Text style={styles.navText}>Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/buyer/OrderHistory')} style={styles.navItem}>
        <FontAwesome name="history" size={24} color="#3aaa58" style={styles.icon} />
        <Text style={styles.navText}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('../buyer/Inbox')} style={styles.navItem}>
        <FontAwesome name="comment" size={24} color="#3aaa58" style={styles.icon} />
        <Text style={styles.navText}>Inbox</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#3aaa58',
    borderWidth: 2,
    paddingVertical: 20,
    borderRadius: 30,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#3aaa58',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  icon: {
    marginBottom: 5,
  },
});

export default BuyerNavBar;
