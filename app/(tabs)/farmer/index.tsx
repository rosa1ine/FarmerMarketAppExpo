import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FarmerDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const sampleOrders = [
    { id: '1', buyer: 'John Doe', quantity: '10 kg', status: 'Pending' },
    { id: '2', buyer: 'Jane Smith', quantity: '5 kg', status: 'Delivered' },
  ];

  useEffect(() => {
    // Fetch farmer products from backend
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in.');
          router.replace('/login'); // Redirect to login if not logged in
          return;
        }

        const response = await fetch('https://farmer-market-33zm.onrender.com/farmer/dashboard/', {
          method: 'GET',
          headers: {
            Authorization: `Token ${token}`, // Use token from AsyncStorage
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
          setTotalProducts(data.total_products || 0);
        } else {
          console.error('Error fetching products:', data);
          Alert.alert('Error', data.message || 'Failed to fetch products.');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productText}>Price: ₹{item.price.toFixed(2)}</Text>
        <Text style={styles.productText}>Stock: {item.quantity_available}</Text>
      </View>
    </View>
  );

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order {item.id}</Text>
      <Text style={styles.orderText}>Buyer: {item.buyer}</Text>
      <Text style={styles.orderText}>Quantity: {item.quantity}</Text>
      <Text style={styles.orderText}>Status: {item.status}</Text>
    </View>
  );

  return (
    <ImageBackground
      style={styles.imgBackground}
      resizeMode="cover"
      source={require('../assets/images/background.jpg')}
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#3aaa58" />
        ) : (
          <>
            {/* Header */}
            <Text style={styles.header}>Your Products</Text>
            <Text style={styles.totalText}>Total Products: {totalProducts}</Text>

            {/* Product List */}
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderProduct}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />

            {/* Add Product Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/farmer/AddProduct')}>
              <Text style={styles.addButtonText}>+ Add New Product</Text>
            </TouchableOpacity>

            {/* Recent Orders */}
            <Text style={styles.header}>Recent Orders</Text>
            <FlatList
              data={sampleOrders}
              keyExtractor={(item) => item.id}
              renderItem={renderOrder}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imgBackground: {
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3aaa58',
    marginVertical: 15,
    textAlign: 'center',
  },
  totalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  productCard: {
    width: 160,
    height: 200, 
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  addButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 40,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  orderText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  
});
