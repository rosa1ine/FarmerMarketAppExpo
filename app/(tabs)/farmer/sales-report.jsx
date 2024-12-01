import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import SalesReportForm from './SalesReportForm';
import SalesReportGraph from './SalesReportGraph';
import ErrorView from './ErrorView';
import { PermissionsAndroid } from 'react-native';

import { PDFDocument, rgb } from 'react-native-pdf-lib';
import fs from 'react-native-fs';
import RNFS from 'react-native-fs';





const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission Required",
        message: "This app needs access to your storage to save the PDF file.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const fetchSalesData = async ({ startDate, endDate, reportType }) => {
  const baseUrl = 'http://localhost:8080/users/farmers/sales-report/';
  const url = `${baseUrl}?start_date=${startDate}&end_date=${endDate}&report_type=${reportType}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.report; // Adjust this based on the structure of your API response
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
    throw error;
  }
};

const SalesReportsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = async ({ startDate, endDate, reportType }) => {
    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const data = await fetchSalesData({ startDate, endDate, reportType });
      setReportData(formatChartData(data)); // Format data for the chart
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (report) => {
    if (!report || report.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            strokeWidth: 2,
          },
        ],
      };
    }
  
    // Determine the field for labels based on the available keys in the report
    const labelKey = report[0].day
      ? "day"
      : report[0].week
      ? "week"
      : report[0].month
      ? "month"
      : null;
  
    if (!labelKey) {
      throw new Error("Invalid report format: Missing 'day', 'week', or 'month' field.");
    }
  
    // Map the labels and dataset
    const labels = report.map((entry) => entry[labelKey]); // Extract labels based on the key
    const dataset = report.map((entry) => entry.revenue); // Extract revenue values
  
    return {
      labels, // Dynamic labels: ["2024-01-01", "2024-W01", "2024-01", etc.]
      datasets: [
        {
          data: dataset, // [0, 100, 200, ...]
          strokeWidth: 2, // Line thickness
        },
      ],
    };
  };
  

  const handleRetry = () => {
    setError(null);
    setReportData(null);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sales Reports</Text>
      <SalesReportForm onGenerateReport={handleGenerateReport} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <ErrorView error={error} onRetry={handleRetry} />}

      {reportData && (
        <>
          <SalesReportGraph data={reportData} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#fff', textAlign: 'center' },
});



  


export default SalesReportsScreen;
