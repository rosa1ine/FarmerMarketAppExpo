import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SalesReportForm = ({ onGenerateReport }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('daily'); // Default to 'daily'

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert('Please provide both start and end dates.');
      return;
    }
    onGenerateReport({ startDate, endDate, reportType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Start Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
        placeholder="2024-01-01"
      />
      <Text style={styles.text}>End Date (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        value={endDate}
        onChangeText={setEndDate}
        placeholder="2024-01-31"
      />
      <Text style={styles.text}>Report Type:</Text>
      <TextInput
        style={styles.input}
        value={reportType}
        onChangeText={setReportType}
        placeholder="daily, weekly, or monthly"
      />
      <Button title="Generate Report" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
    color: '#fff',
  },
  text:{color:'#fff'},
});

export default SalesReportForm;
