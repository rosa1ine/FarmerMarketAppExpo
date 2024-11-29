import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch inbox messages from API
  const fetchInboxMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      const response = await fetch('https://farmer-market-33zm.onrender.com/chat/my-messages/', {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Failed to fetch inbox:', errorMessage);
        Alert.alert('Error', 'Failed to load messages.');
        return;
      }

      const data = await response.json();
      setMessages(data.results || []);
    } catch (error) {
      console.error('Error fetching inbox:', error);
      Alert.alert('Error', 'An unexpected error occurred while fetching messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInboxMessages();
  }, []);

  const navigateToChat = (receiverId, receiverName) => {
    router.push({
      pathname: './Chat', // Assuming your `Chat.tsx` file is mapped to `/Chat` in your routes
      params: { receiverId, receiverName },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => navigateToChat(item.receiver, item.sender_profile.name)}
    >
      <Image
        source={{ uri: item.sender_profile?.avatar || 'https://via.placeholder.com/150' }}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.sender_profile?.name || 'Unknown'}</Text>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.time}>{new Date(item.date).toLocaleTimeString()}</Text>
        {!item.is_read && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>New</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4caf50" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#FF3D00',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 5,
  },
  unreadText: {
    fontSize: 12,
    color: '#FFF',
  },
});

export default Inbox;
