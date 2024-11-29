import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in.');
          router.replace('/login');
          return;
        }

        const response = await fetch(
          'https://farmer-market-33zm.onrender.com/users/buyers/order/history/',
          {
            method: 'GET',
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch order history.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        Alert.alert('Error', 'An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3aaa58" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No orders placed yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderText}>
              <Text style={styles.label}>Date:</Text> {new Date(item.order_date).toLocaleDateString()}
            </Text>
            <Text style={styles.orderText}>
              <Text style={styles.label}>Total:</Text> ₸{item.total_price}
            </Text>
            <Text style={styles.orderText}>
              <Text style={styles.label}>Status:</Text> {item.is_completed ? 'Completed' : 'In Progress'}
            </Text>
            <Text style={styles.orderText}>
              <Text style={styles.label}>Delivery Address:</Text> {item.delivery_details}
            </Text>
            <Text style={styles.label}>Items:</Text>
            {item.items.map((product, index) => (
              <Text key={index} style={styles.itemText}>
                - Product {index + 1}: Quantity: {product.quantity}, Price: ₸{product.prices}
              </Text>
            ))}
            {/* Add navigation to Order Tracking */}
            <TouchableOpacity
  style={styles.trackButton}
  onPress={() => navigation.navigate('buyer/OrderTracking', { order: item })}
>
  <Text style={styles.trackButtonText}>Track Order</Text>
</TouchableOpacity>







          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3aaa58',
    textAlign: 'center',
  },
  orderItem: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orderText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#3aaa58',
  },
  trackButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
