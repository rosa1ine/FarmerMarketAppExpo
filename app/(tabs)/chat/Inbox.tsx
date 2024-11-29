import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      pathname: './Chat',
      params: { receiverId, receiverName },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => navigateToChat(item.receiver, item.sender_profile.name)}
    >
      <View style={styles.avatarContainer}>
      <Image
        source={require('../assets/images/avatar.png')}
        style={styles.avatar}
      />

      </View>
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
  <ImageBackground
    style={styles.imgBackground}
    resizeMode="cover"
    source={require('../assets/images/Chat.png')}
  >
    <View style={styles.container}>
      <Text style={styles.header}>My Inbox</Text>
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
  </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  imgBackground: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 50,
    color: '#FFA500',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    zIndex: 0, // Ensures shadows are not clipped due to sibling components
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3f65',
    marginBottom: 5,
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
