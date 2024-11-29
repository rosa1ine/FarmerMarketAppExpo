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
  const [deliveryDetails, setDeliveryDetails] = useState('');

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

      const response = await fetch(
        'https://farmer-market-33zm.onrender.com/users/buyers/cart/',
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

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

  const handleApplyPromo = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        'https://farmer-market-33zm.onrender.com/users/buyers/cart/apply-promo/',
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ promo_code: promoCode }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Promo code applied successfully!');
        setTotal(data.new_total); // Assuming the API returns a new total
      } else {
        Alert.alert('Error', data.message || 'Failed to apply promo code.');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      Alert.alert('Error', 'An error occurred while applying the promo code.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('https://farmer-market-33zm.onrender.com/users/buyers/place-order/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          delivery_details: deliveryAddress, // Ensure this is filled
        }),
      });
  
      const data = await response.json();
      console.log('Place Order API Response:', data); // Add this log
  
      if (response.ok) {
        Alert.alert('Success', 'Order placed successfully!');
        router.push('/buyer/OrderHistory'); // Redirect to order history
      } else {
        Alert.alert('Error', data.message || 'Failed to place order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'An error occurred while placing the order.');
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
          </View>
        )}
      />
      <View style={styles.promoContainer}>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter Promo Code"
          placeholderTextColor="#666" // Slightly darker placeholder color
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.promoButton} onPress={handleApplyPromo}>
          <Text style={styles.promoButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.deliveryContainer, { marginTop: 10 }]}>
        <TextInput
          style={styles.deliveryInput}
          placeholder="Enter Delivery Address"
          placeholderTextColor="#666" // Slightly darker placeholder color
          value={deliveryDetails}
          onChangeText={setDeliveryDetails}
        />
      </View>
      <View style={styles.summary}>
        <Text style={styles.totalText}>Total: ₸{total}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handlePlaceOrder}>
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
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
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
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#555',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8, // Reduced space here
  },
  promoInput: {
    flex: 1,
    borderColor: '#3aaa58',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  promoButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deliveryContainer: {
    marginTop: 8, // Reduced space here
  },
  deliveryInput: {
    borderColor: '#3aaa58',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#3aaa58',
    backgroundColor: '#fff',
    borderRadius: 18,
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
