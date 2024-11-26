import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddProduct() {
  const router = useRouter();

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [popularity, setPopularity] = useState('');
  const [image, setImage] = useState(null);
  const [isImageSaved, setIsImageSaved] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://farmer-market-33zm.onrender.com/products/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Fetch Categories Error:', error.message);
        Alert.alert('Error', 'Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setIsImageSaved(false);
    }
  };

  const handleImageSave = () => {
    if (image) {
      setIsImageSaved(true);
      Alert.alert('Image Saved', 'Image has been saved successfully!');
    } else {
      Alert.alert('No Image', 'Please select an image first.');
    }
  };

  const handleAddProduct = async () => {
    if (
      !productName ||
      !price ||
      !description ||
      !quantity ||
      !category ||
      !popularity ||
      !isImageSaved
    ) {
      Alert.alert('Error', 'Please fill in all fields and save the image.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      const formData = new FormData();
      formData.append('name', productName);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('quantity_available', quantity);
      formData.append('category', category); // Send category ID
      formData.append('popularity', popularity);

      const imageName = image.split('/').pop();
      const imageType = `image/${imageName.split('.').pop()}`;

      formData.append('image', {
        uri: image,
        name: imageName,
        type: imageType,
      });

      const response = await axios.post(
        'https://farmer-market-33zm.onrender.com/farmer/products/create/',
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Product added successfully!');
        router.back();
      } else {
        Alert.alert('Error', 'Failed to add product. Please try again.');
      }
    } catch (error) {
      console.error('Add Product Error:', error.response?.data || error.message);
      Alert.alert('Error', 'An error occurred while adding the product.');
    }
  };

  return (
    <ImageBackground
      style={styles.imgBackground}
      resizeMode="cover"
      source={require('../assets/images/background.jpg')}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Add New Product</Text>

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
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={[styles.input, styles.quantityInput]}
          placeholder="Quantity Available"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={[styles.input, styles.popularityInput]}
          placeholder="Popularity (e.g., 1-100)"
          keyboardType="numeric"
          value={popularity}
          onChangeText={setPopularity}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          <Text style={styles.imagePickerText}>
            {image ? 'Change Image' : 'Pick an Image'}
          </Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            {!isImageSaved && (
              <TouchableOpacity style={styles.saveImageButton} onPress={handleImageSave}>
                <Text style={styles.saveImageButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Add the picker container style
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#3aaa58',
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 15,
    overflow: 'hidden',
  },
  // Other styles remain the same
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBackground: {
    flex: 1,
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
  productInput: {
    borderColor: '#264653',
  },
  priceInput: {
    borderColor: '#f4a261',
  },
  descriptionInput: {
    borderColor: '#2a9d8f',
  },
  quantityInput: {
    borderColor: '#e76f51',
  },
  popularityInput: {
    borderColor: '#3aaa58',
  },
  imagePicker: {
    width: '100%',
    padding: 15,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveImageButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveImageButtonText: {
    color: '#3aaa58',
    fontWeight: 'bold',
    fontSize: 17,
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
});