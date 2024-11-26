import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchNavBar: React.FC<{
  onSearch: (query: string, filters: any) => void;
  onSort: (option: string) => void;
}> = ({ onSearch, onSort }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleSearch = () => {
    const filters = { category, priceRange };
    onSearch(searchQuery, filters);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Picker */}
      <Picker
        selectedValue={category}
        onValueChange={(value) => setCategory(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Fruits" value="fruits" />
        <Picker.Item label="Vegetables" value="vegetables" />
      </Picker>

      {/* Price Range */}
      <View style={styles.priceContainer}>
        <TextInput
          style={[styles.priceInput, { marginRight: 5 }]}
          placeholder="Min Price"
          keyboardType="numeric"
          value={priceRange.min}
          onChangeText={(value) => setPriceRange({ ...priceRange, min: value })}
        />
        <TextInput
          style={[styles.priceInput, { marginLeft: 5 }]}
          placeholder="Max Price"
          keyboardType="numeric"
          value={priceRange.max}
          onChangeText={(value) => setPriceRange({ ...priceRange, max: value })}
        />
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* Sort Options */}
      <Picker
        selectedValue=""
        onValueChange={(value) => onSort(value)}
        style={styles.picker}
      >
        <Picker.Item label="Sort By" value="" />
        <Picker.Item label="Price: Low to High" value="priceAsc" />
        <Picker.Item label="Price: High to Low" value="priceDesc" />
        <Picker.Item label="Newest" value="newest" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10, // Reduced padding
    borderRadius: 8, // Slightly smaller radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 15, // Reduced bottom margin
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 8, // Reduced padding
    paddingVertical: 6, // Reduced vertical padding
    borderRadius: 6, // Slightly smaller radius
    marginBottom: 8, // Reduced spacing
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12, // Smaller font size
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
picker: {
  height: 40, // Keep the height same as before
  backgroundColor: '#f9f9f9',
  borderRadius: 6,
  marginBottom: 8,
  paddingHorizontal: 8,
  borderColor: '#ccc',
  borderWidth: 1,
  fontSize: 16, // Set a readable font size
  lineHeight: 18, // Ensure proper spacing for text
  justifyContent: 'center', // Center the text vertically
  color: '#333', // Darker text for better visibility
},

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Reduced spacing
  },
  priceInput: {
    flex: 1,
    height: 35, // Reduced height
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8, // Reduced padding
    backgroundColor: '#f9f9f9',
    fontSize: 12, // Smaller font size
    marginHorizontal: 5,
  },
  searchButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 8, // Reduced padding
    borderRadius: 6,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14, // Smaller font size
  },
});


export default SearchNavBar;
