import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ErrorView = ({ error, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>Error: {error.message}</Text>
    <Button title="Retry" onPress={onRetry} />
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 16 },
});

export default ErrorView;
