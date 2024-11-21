  import React from 'react';
  import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
  import { useRouter } from 'expo-router';

  export default function Welcome() {
    const router = useRouter();

    return (
      <ImageBackground style={ styles.imgBackground } resizeMode='cover' source={require('./assets/images/homescreenbackground.jpg')}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.app_name}>Farmer Market</Text>
          </View>

          <Text style={styles.subtitle}>Choose your action</Text>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push('/authentification/login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push('/authentification/register')}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  const styles = StyleSheet.create({
   
    imgBackground: {
      width: 'auto',
      height: 'auto',
      flex: 1 
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    header: {
      position: 'absolute',
      top: 100, 
      left: 30,
      alignItems: 'flex-start', 
    },
    title: {
      fontSize: 33,
      fontWeight: 'bold',
      color: '#f97d5e',
      marginBottom: 5,
    },
    app_name: {
      fontSize: 36,
      fontWeight: '500',
      color: '#3aaa58',
    },
    subtitle: {
      fontSize: 18,
      color: '#fff',
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    button: {
      padding: 15,
      borderRadius: 30,
      marginVertical: 8,
      alignItems: 'center',
      width: '80%',
      elevation: 5, // Shadow for Android
      shadowColor: '#ffffff', // White shadow color
      shadowOffset: { width: 0, height: 4 }, // Shadow position
      shadowOpacity: 0.4, // Shadow transparency
      shadowRadius: 10, // Shadow blur
    },
    
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
    },
  
    loginButton: {
      backgroundColor: '#3aaa58',
    },
    registerButton: {
      backgroundColor: '#f97d5e', 
    },
  });
