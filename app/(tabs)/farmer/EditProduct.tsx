import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Text,
    View,
    TextInput,
    Alert,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const EditProduct = () => {
  const router = useRouter();
  const { product_id } = useLocalSearchParams();

  const [product, setProduct] = useState({
      name: '',
      price: '',
      quantity: '',
      category: '', // Ensure this is initially empty
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchProductDetails = async () => {
      try {
          setLoading(true);
          const token = await AsyncStorage.getItem('authToken');
          if (!token) {
              Alert.alert('Error', 'You are not logged in.');
              router.replace('/authentification/login');
              return;
          }

          const response = await fetch(
              `https://farmer-market-33zm.onrender.com/farmer/dashboard/`,
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
              const products = data.products || [];
              const product = products.find((item) => item.product_id.toString() === product_id);

              if (product) {
                  setProduct({
                      name: product.name || '',
                      price: product.price?.toString() || '',
                      quantity: product.quantity_available?.toString() || '',
                      category: product.category_id || '', 
                  });
              } else {
                  Alert.alert('Error', 'Product not found.');
                  router.replace('./index');
              }
          } else {
              Alert.alert('Error', data.message || 'Failed to fetch product details.');
          }
      } catch (error) {
          console.error('Error fetching product details:', error);
          Alert.alert('Error', 'An error occurred while fetching product details.');
      } finally {
          setLoading(false);
      }
  };

    const fetchCategories = async () => {
        try {
            const response = await fetch('https://farmer-market-33zm.onrender.com/products/categories/');
            
            // Check if the response is ok
            if (!response.ok) {
                console.error('Failed to fetch categories:', response.status, response.statusText);
                Alert.alert('Error', `Failed to fetch categories. Status: ${response.status}`);
                return;
            }

            const data = await response.json();

            // Log the fetched categories
            console.log('Categories:', data);

            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error.message);
            Alert.alert('Error', 'Failed to fetch categories.');
        }
    };


    const handleSave = async () => {
        if (!product.name || !product.price || !product.quantity || !product.category) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        try {
            setSaving(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Error', 'You are not logged in.');
                router.replace('/authentification/login');
                return;
            }

            const response = await fetch(
                `https://farmer-market-33zm.onrender.com/farmer/product/${product_id}/update/`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: product.name,
                        price: parseFloat(product.price),
                        quantity_available: parseInt(product.quantity),
                        category_id: parseInt(product.category),
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Product updated successfully!');
                router.replace('/farmer');
            } else {
                console.error('Error response:', data);
                Alert.alert('Error', data.message || 'Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'An error occurred while updating the product.');
        } finally {
            setSaving(false);
        }
    };



  const handleInputChange = (key, value) => {
      setProduct((prevState) => ({
          ...prevState,
          [key]: value,
      }));
  };

  useEffect(() => {
      fetchProductDetails();
      fetchCategories();
  }, [product_id]);

  if (loading) {
      return <ActivityIndicator size="large" color="#3aaa58" style={styles.loadingIndicator} />;
  }

  return (
      <ImageBackground
          style={styles.imgBackground}
          resizeMode="cover"
          source={require('../assets/images/background.jpg')}
      >
          <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.header}>Edit Product</Text>

              <TextInput
                  style={[styles.input, styles.productInput]}
                  placeholder="Product Name"
                  value={product.name}
                  onChangeText={(text) => handleInputChange('name', text)}
              />
              <TextInput
                  style={[styles.input, styles.priceInput]}
                  placeholder="Price"
                  keyboardType="numeric"
                  value={product.price}
                  onChangeText={(text) => handleInputChange('price', text)}
              />
              <TextInput
                  style={[styles.input, styles.quantityInput]}
                  placeholder="Quantity Available"
                  keyboardType="numeric"
                  value={product.quantity}
                  onChangeText={(text) => handleInputChange('quantity', text)}
              />
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={product.category} // Ensures the selected category is displayed
                    onValueChange={(itemValue) => 
                        setProduct({ ...product, category: itemValue }) // Updates the product's category
                    }
                >
                    <Picker.Item label="Select Category" value="" />
                    {categories.map((cat) => (
                        <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                    ))}
                </Picker>
            </View>


              <TouchableOpacity
                  style={styles.button}
                  onPress={handleSave}
                  disabled={saving}
              >
                  <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Update Product'}</Text>
              </TouchableOpacity>
          </ScrollView>
      </ImageBackground>
  );
};

const styles = StyleSheet.create({
    imgBackground: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#3aaa58',
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#3aaa58',
        backgroundColor: '#fff',
        width: '100%',
        marginBottom: 15,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#3aaa58',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    productInput: {
        borderColor: '#264653',
    },
    priceInput: {
        borderColor: '#f4a261',
    },
    quantityInput: {
        borderColor: '#e76f51',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditProduct;
