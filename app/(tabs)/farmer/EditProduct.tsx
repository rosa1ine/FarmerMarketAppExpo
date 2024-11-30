import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Text,
    View,
    TextInput,
    Alert,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const EditProduct = () => {
    const router = useRouter();
    const { product_id } = useLocalSearchParams();

    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');
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
                    setProductName(product.name || '');
                    setPrice(product.price?.toString() || '');
                    setQuantity(product.quantity_available?.toString() || '');
                    setCategory(product.category || '');
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
            const data = await response.json();

            if (response.ok) {
                setCategories(data);
            } else {
                Alert.alert('Error', 'Failed to fetch categories.');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            Alert.alert('Error', 'Failed to fetch categories.');
        }
    };

    const handleSave = async () => {
        if (!productName || !price || !quantity || !category) {
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

            const requestBody = {
                name: productName,
                price: parseFloat(price),
                quantity_available: parseInt(quantity),
                category: parseInt(category),
            };

            const response = await fetch(
                `https://farmer-market-33zm.onrender.com/farmer/product/${product_id}/update/`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if (response.ok) {
                Alert.alert('Success', 'Product updated successfully!');
                router.replace('/farmer');
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'An error occurred while updating the product.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('authToken');
                            if (!token) {
                                Alert.alert('Error', 'You are not logged in.');
                                router.replace('/authentification/login');
                                return;
                            }
    
                            const response = await fetch(
                                `https://farmer-market-33zm.onrender.com/farmer/product/${product_id}/delete/`,
                                {
                                    method: 'DELETE',
                                    headers: {
                                        Authorization: `Token ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );
    
                            if (response.ok) {
                                Alert.alert('Success', 'Product deleted successfully!');
                                router.replace('/farmer');
                            } else {
                                const data = await response.json();
                                Alert.alert('Error', data.message || 'Failed to delete product.');
                            }
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            Alert.alert('Error', 'An error occurred while deleting the product.');
                        }
                    },
                },
            ]
        );
    };

    const handleMarkOutOfStock = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Error', 'You are not logged in.');
                router.replace('/authentification/login');
                return;
            }
    
            const response = await fetch(
                `https://farmer-market-33zm.onrender.com/farmer/products/${product_id}//out_of_stock/`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.ok) {
                Alert.alert('Success', 'Product marked as out of stock.');
                setQuantity('0'); // Update quantity to reflect "Out of Stock" state.
            } else {
                const data = await response.json();
                Alert.alert('Error', data.message || 'Failed to mark as out of stock.');
            }
        } catch (error) {
            console.error('Error marking product as out of stock:', error);
            Alert.alert('Error', 'An error occurred while marking the product as out of stock.');
        }
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
                    value={productName}
                    onChangeText={setProductName}
                />
                <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="Price"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />
                <View style={styles.quantityContainer}>
                    <TextInput
                        style={[styles.input, styles.quantityInput]}
                        placeholder="Quantity Available"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                    <TouchableOpacity
                        style={[styles.button, styles.outOfStockButton]}
                        onPress={handleMarkOutOfStock}
                    >
                        <Text style={styles.quantityButtonText}>Out of Stock</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={category}
                        onValueChange={setCategory}
                    >
                        <Picker.Item label="Select Category" value="" />
                        {categories.map((cat) => (
                            <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
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

                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDelete}
                >
                    <Text style={styles.buttonText}>Delete Product</Text>
                </TouchableOpacity>

            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    imgBackground: {
        flex: 1,
        width: '100%', 

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
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#e63946',
        marginTop: 10,
    },
    quantityInput: {
        borderColor: '#e76f51',
        flex: 0.75, // Occupies 75% of the container width
        marginRight: 10, // Adds some space between the input and button
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        backgroundColor: '#fff',
    },
    outOfStockButton: {
        backgroundColor: '#f97d5e',
        flex: 0.40, 
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 5, 

    },
    quantityContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10,
    },
    quantityButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    
});

export default EditProduct;
