import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://farmer-market-33zm.onrender.com/products/list/');
        if (!response.ok) throw new Error('Failed to fetch products.');

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProductCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.text}>Category: {item.category}</Text>
        <Text style={styles.text}>Price: ₸{item.price}</Text>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => navigation.navigate('buyer/ProductDetail', { productId: item.id })}
        >
          <Text style={styles.detailButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Best Products</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3aaa58" />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductCard}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3aaa58',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    maxWidth: '48%',
  },
  image: {
    height: 120,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  detailButton: {
    marginTop: 10,
    backgroundColor: '#3aaa58',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
