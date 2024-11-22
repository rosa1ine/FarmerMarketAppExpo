import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const FarmerProfile = () => {
    return (
        <ScrollView style={styles.container}>
            {/* Profile Management Section */}
            <Text style={styles.header}>Profile Management</Text>
            <TextInput style={styles.input} placeholder="Name" />
            <TextInput style={styles.input} placeholder="Contact Info" />
            <TextInput style={styles.input} placeholder="Farm Location" />
            <Button title="Upload Profile Picture" onPress={() => {}} />
            <Button title="Save Profile" onPress={() => {}} />

            {/* Farm Information Section */}
            <Text style={styles.header}>Farm Information</Text>
            <TextInput style={styles.input} placeholder="Farm Size" />
            <TextInput style={styles.input} placeholder="Location" />
            <TextInput style={styles.input} placeholder="Types of Crops" />
            <TextInput style={styles.input} placeholder="Available Resources" />
            <Button title="Save Farm Info" onPress={() => {}} />

            {/* Resource Management Section */}
            <Text style={styles.header}>Resource Management</Text>
            <TextInput style={styles.input} placeholder="Add Resource" />
            <Button title="Add" onPress={() => {}} />
            <Button title="Update" onPress={() => {}} />
            <Button title="Delete" onPress={() => {}} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#f9f9f9' },
    header: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12, padding: 8 },
});

export default FarmerProfile;
