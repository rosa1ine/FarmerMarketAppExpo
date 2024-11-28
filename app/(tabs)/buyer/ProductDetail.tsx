import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { params } = useRoute();
  const { productId } = params;

  const router = useRouter();

  useEffect(() => {

    // Fetch product details
    const fetchProductDetail = async () => {
      try {
        const response = await fetch('https://farmer-market-33zm.onrender.com/products/list/');
        if (!response.ok) throw new Error('Failed to fetch product details.');

        const data = await response.json();
        const selectedProduct = data.find((item) => item.id === productId);

        if (!selectedProduct) throw new Error('Product not found.');
        setProduct(selectedProduct);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleChat = () => {
    if (product?.farmer?.id) {
      router.push({
        pathname: '../chat/Chat',
        params: { receiverId: product.farmer.user, receiverName: product.farmer.name},
      });
    } else {
      Alert.alert('Error', 'Unable to start chat. Missing farmer information.');
    }
  };
  

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3aaa58" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.name}>{product.name}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Category:</Text> {product.category}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Description:</Text> {product.description}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Price:</Text> ₸{product.price}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Farmer:</Text> {product.farmer?.name || 'N/A'}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Location:</Text> {product.farmer?.location || 'N/A'}
        </Text>
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <Text style={styles.chatButtonText}>Chat</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#3aaa58',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 10,
    paddingHorizontal: 40,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  chatButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#f97d5e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  addToCartText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#ff6347',
    textAlign: 'center',
    marginTop: 20,
  },
});
