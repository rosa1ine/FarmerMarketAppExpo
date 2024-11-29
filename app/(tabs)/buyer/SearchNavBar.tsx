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
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Fruits" value="Fruits" />
          <Picker.Item label="Vegetables" value="Vegetables" />
        </Picker>
      </View>

      {/* Price Range */}
      <View style={styles.priceContainer}>
        <TextInput
          style={[styles.priceInput, { marginRight: 8 }]}
          placeholder="Min Price"
          keyboardType="numeric"
          onChangeText={(value) => setPriceRange({ ...priceRange, min: value })}
        />
        <TextInput
          style={[styles.priceInput, { marginLeft: 8 }]}
          placeholder="Max Price"
          keyboardType="numeric"
          onChangeText={(value) => setPriceRange({ ...priceRange, max: value })}
        />
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* Sort Options */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Sort By</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  icon: {
    marginRight: 5,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#555',
  },
  picker: {
    height: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#3aaa58',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

export default SearchNavBar;