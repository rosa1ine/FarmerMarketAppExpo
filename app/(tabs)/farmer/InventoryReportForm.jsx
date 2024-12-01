import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const InventoryReportForm = ({ onGenerateReport, onGeneratePDF }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert('Please fill in both start date and end date.');
      return;
    }

    // Call the corresponding function to generate the report
    onGenerateReport({ startDate, endDate });
  };

  const handlePDFSubmit = () => {
    if (!startDate || !endDate) {
      alert('Please fill in both start date and end date.');
      return;
    }

    // Call the function to generate the PDF
    onGeneratePDF({ startDate, endDate });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Generate Inventory Report</Text>

      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={startDate}
        onChangeText={setStartDate}
        keyboardType="numeric"
      />

      <Text style={styles.label}>End Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={endDate}
        onChangeText={setEndDate}
        keyboardType="numeric"
      />

      <Button title="Generate Report" onPress={handleSubmit} />
      <Button title="Generate PDF Report" onPress={handlePDFSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 4,
  },
});

export default InventoryReportForm;
