import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, ScrollView } from 'react-native';
import InventoryReportForm from './InventoryReportForm';
import ErrorView from './ErrorView';

const InventoryReportsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null); // Store the formatted data

  // Fetch and display report data
  const handleGenerateReport = async ({ startDate, endDate }) => {
    setLoading(true);
    setError(null);
    setData(null); // Reset data

    try {
      const apiUrl = `https://farmer-market-33zm.onrender.com/products/inventory-report/?start_date=${startDate}&end_date=${endDate}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch inventory report');
      }

      const responseData = await response.json();
      setData(responseData); // Store the raw JSON data

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch and generate PDF report
  const handleGeneratePDF = async ({ startDate, endDate }) => {
    setLoading(true);
    setError(null);
    setData(null); // Reset data

    try {
      const apiUrl = `https://farmer-market-33zm.onrender.com/products/inventory-report/?start_date=${startDate}&end_date=${endDate}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();

      setData({ message: 'PDF report generated successfully' });

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setData(null);
  };

  const renderFormattedData = () => {
    if (!data) return null;

    return (
      <View style={styles.dataContainer}>
        {data.low_stock_items && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Low Stock Items:</Text>
            {data.low_stock_items.length > 0 ? (
              data.low_stock_items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemText}>Name: {item.name}</Text>
                  <Text style={styles.itemText}>Quantity Available: {item.quantity_available}</Text>
                  <Text style={styles.itemText}>Low Stock Threshold: {item.low_stock_threshold}</Text>
                </View>
              ))
            ) : (
              <Text>No low stock items.</Text>
            )}
          </View>
        )}

        {data.turnover_rate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Turnover Rate:</Text>
            <Text style={styles.itemText}>{data.turnover_rate}</Text>
          </View>
        )}

        {/* Add more sections for additional data as needed */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inventory Reports</Text>
      <InventoryReportForm
        onGenerateReport={handleGenerateReport}
        onGeneratePDF={handleGeneratePDF}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <ErrorView error={error} onRetry={handleRetry} />}

      {/* Render Formatted Data */}
      {renderFormattedData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  dataContainer: { marginTop: 20, padding: 10, borderRadius: 8, backgroundColor: '#f4f4f4' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  itemRow: { marginBottom: 8 },
  itemText: { fontSize: 16, color: '#333' },
});

export default InventoryReportsScreen;
