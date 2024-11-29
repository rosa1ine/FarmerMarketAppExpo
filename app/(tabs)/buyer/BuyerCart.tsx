
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function BuyerCart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState('');

  // Fetch cart data
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('Token being sent:', token);
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        router.replace('/login');
        return;
      }

      const response = await fetch('https://farmer-market-33zm.onrender.com/users/buyers/cart/', {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Cart API Response:', data);

      if (response.ok) {
        setCart(data.items || []);
        setTotal(data.total || 0);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch cart.');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      Alert.alert('Error', 'An error occurred while fetching cart data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle applying promo codes
  const handleApplyPromo = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://farmer-market-33zm.onrender.com/users/buyers/cart/apply-promo/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promo_code: promoCode }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Promo code applied successfully!');
        setTotal(data.new_total); // Assuming the API returns the updated total
      } else {
        Alert.alert('Error', data.message || 'Failed to apply promo code.');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      Alert.alert('Error', 'An error occurred while applying the promo code.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3aaa58" />
      </View>
    );
  }

  if (!loading && cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.product_name}</Text>
            <Text style={styles.itemPrice}>Price: ₸{item.product_price}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => {}}>
              {/* Delete functionality commented out */}
              <Text style={styles.deleteButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.promoContainer}>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter Promo Code"
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.promoButton} onPress={handleApplyPromo}>
          <Text style={styles.promoButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <Text style={styles.totalText}>Total: ₸{total}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => {}}>
          {/* Place order functionality commented out */}
          <Text style={styles.checkoutButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f6f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3aaa58',
    textAlign: 'center',
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
  cartItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: '#777',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#777',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  promoInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  promoButton: {
    backgroundColor: '#3aaa58',
    padding: 12,
    borderRadius: 5,
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summary: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
