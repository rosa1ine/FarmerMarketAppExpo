import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const SearchNavBar: React.FC<{
  onSearch: (query: string, filters: any) => void;
  onSort: (option: string) => void;
}> = ({ onSearch, onSort }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [organicOnly, setOrganicOnly] = useState(false);

  const handleSearch = () => {
    const filters = { category, priceRange, organicOnly };
    onSearch(searchQuery, filters);
  };

  return (
    <View style={styles.navBar}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Picker
        selectedValue={category}
        onValueChange={(value) => setCategory(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Fruits" value="Fruits" />
        <Picker.Item label="Vegetables" value="Vegetables" />
      </Picker>
      <TextInput
        style={styles.filterInput}
        placeholder="Min Price"
        keyboardType="numeric"
        onChangeText={(value) => setPriceRange({ ...priceRange, min: value })}
      />
      <TextInput
        style={styles.filterInput}
        placeholder="Max Price"
        keyboardType="numeric"
        onChangeText={(value) => setPriceRange({ ...priceRange, max: value })}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
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
    flex: 1,
    padding: 10, // Reduced padding
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 20, // Slightly smaller font size
    fontWeight: 'bold',
    marginBottom: 10, // Reduced margin
    color: '#3aaa58',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 10, // Reduced padding
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8, // Reduced row margin
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8, // Slightly smaller border radius
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3, // Reduced shadow size
    elevation: 2,
    maxWidth: '48%', // Keep cards at 48% width
  },
  image: {
    height: 100, // Reduced height
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  infoContainer: {
    padding: 8, // Reduced padding
  },
  name: {
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
    marginBottom: 4, // Reduced margin
    color: '#333',
  },
  text: {
    fontSize: 12, // Smaller font size
    color: '#555',
  },
  detailButton: {
    marginTop: 6, // Reduced margin
    backgroundColor: '#3aaa58',
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 8,
    borderRadius: 15, // Smaller border radius
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 12, // Reduced font size
    fontWeight: 'bold',
  },
});


export default SearchNavBar;
