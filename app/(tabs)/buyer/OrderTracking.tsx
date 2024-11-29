import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function OrderTracking() {
  const route = useRoute();
  const { order } = route.params; // Access the passed order parameter

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Order details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Track Order</Text>
      <Text style={styles.detail}>Order ID: {order.id}</Text>
      <Text style={styles.detail}>Total Price: ₸{order.total_price}</Text>
      <Text style={styles.detail}>Delivery Address: {order.delivery_details}</Text>
      <Text style={styles.detail}>
        Status: {order.is_completed ? 'Completed' : 'In Progress'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3aaa58',
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: '#ff6347',
  },
});


