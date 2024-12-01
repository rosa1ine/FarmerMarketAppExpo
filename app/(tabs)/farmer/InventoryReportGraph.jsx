import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';  // Example: You can use a chart library

const InventoryReportGraph = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <Text>No low stock items available for display.</Text>;
  }

  // Example: Prepare data for the bar chart
  const chartData = {
    labels: data.map(item => item.name), // Names of products
    datasets: [
      {
        data: data.map(item => item.quantity_available), // Quantities of products
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Low Stock Items</Text>
      <BarChart
        data={chartData}
        width={400}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default InventoryReportGraph;
