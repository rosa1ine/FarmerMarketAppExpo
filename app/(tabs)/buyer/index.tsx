import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const products = [
  { id: 1, name: 'Tomatoes', price: '$2/kg' },
  { id: 2, name: 'Potatoes', price: '$1.5/kg' },
];

export default function BuyerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name} - {item.price}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
  item: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
});
