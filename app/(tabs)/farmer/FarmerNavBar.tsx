import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons

const FarmerNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.push('/farmer')} style={styles.navItem}>
        <FontAwesome name="home" size={24} color="#3aaa58" style={styles.icon} />
        <Text style={styles.navText}>Home</Text> {/* Text wrapped in <Text> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/farmer/FarmerProfileStart')} style={styles.navItem}>
        <FontAwesome name="user" size={24} color="#3aaa58" style={styles.icon} />
        <Text style={styles.navText}>Profile</Text> {/* Text wrapped in <Text> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('../farmer/Inbox')} style={styles.navItem}>
        <FontAwesome name="comment" size={24} color="#3aaa58" style={styles.icon} />
        <Text style={styles.navText}>Inbox</Text> {/* Text wrapped in <Text> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/farmer/InventoryReportsScreen')} style={styles.navItem}>
        <FontAwesome name="archive" size={24} color="#3aaa58" style={styles.icon} /> {/* Icon for Inventory Reports */}
        <Text style={styles.navText}>Report 1</Text> {/* Text wrapped in <Text> */}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/farmer/sales-report')} style={styles.navItem}>
        <FontAwesome name="bar-chart" size={24} color="#3aaa58" style={styles.icon} /> {/* Icon for Sales Reports */}
        <Text style={styles.navText}>Report 2</Text> {/* Text wrapped in <Text> */}
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

export default FarmerNavBar;
