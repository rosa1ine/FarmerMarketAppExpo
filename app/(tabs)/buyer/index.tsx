import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Animated
} from 'react-native';
import BuyerNavBar from './BuyerNavBar';
import SearchNavBar from './SearchNavBar';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(''); // For sorting
  const navigation = useNavigation();

  const [isFilterVisible, setIsFilterVisible] = useState(false); 

  const [filterHeight, setFilterHeight] = useState(0);



  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://farmer-market-33zm.onrender.com/products/list/');
        if (!response.ok) throw new Error('Failed to fetch products.');

        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search and filters
  const handleSearch = (query, filters) => {
    let filtered = products;

    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter((product) => product.category === filters.category);
    }

    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter(
        (product) =>
          (!filters.priceRange.min || product.price >= parseFloat(filters.priceRange.min)) &&
          (!filters.priceRange.max || product.price <= parseFloat(filters.priceRange.max))
      );
    }

    if (filters.organicOnly) {
      filtered = filtered.filter((product) => product.isOrganic);
    }

    if (filters.location) {
      filtered = filtered.filter((product) => product.location.includes(filters.location));
    }

    if (filters.deliveryOption) {
      filtered = filtered.filter((product) => product.deliveryOption === filters.deliveryOption);
    }

    setFilteredProducts(sortProducts(filtered, sortOption)); // Apply sort after filtering
  };

  // Sorting products
  const sortProducts = (products, option) => {
    switch (option) {
      case 'priceAsc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'popularity':
        return [...products].sort((a, b) => b.popularity - a.popularity);
      case 'newest':
        return [...products].sort(
          (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      default:
        return products;
    }
  };

  const toggleFilter = () => {
    if (isFilterVisible) {
      setFilterHeight(0); // Collapse filter
    } else {
      setFilterHeight(400); // Set a large enough height for all filtering options
    }
    setIsFilterVisible(!isFilterVisible);
  };

  // Update filtered products when the sort option changes
  useEffect(() => {
    setFilteredProducts(sortProducts(filteredProducts, sortOption));
  }, [sortOption]);

  // Render individual product cards
  const renderProductCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
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
      {/* Filter Toggle Button */}
      <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
        <Text style={styles.filterButtonText}>
          {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
        </Text>
      </TouchableOpacity>

      <Animated.View style={{ height: filterHeight, overflow: 'hidden' }}>
        <SearchNavBar
          onSearch={(query, filters) => handleSearch(query, filters)}
          onSort={(option) => setSortOption(option)}
        />
      </Animated.View>

      {/* Header */}
      <Text style={styles.header}>Our Best Products</Text>

      {/* Product List */}
      {loading ? (
        <ActivityIndicator size="large" color="#3aaa58" />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductCard}
          numColumns={2}
          contentContainerStyle={[styles.list, { paddingBottom: 80 }]}
          columnWrapperStyle={styles.row}
        />
      )}

      {/* Navigation Bar */}
      <View style={styles.buyerNavBar}>
        <BuyerNavBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  filterButton: {
    backgroundColor: '#3aaa58',
    padding: 12,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#3aaa58',
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 10,
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
  buyerNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3aaa58',
    justifyContent: 'center',
  },
});
