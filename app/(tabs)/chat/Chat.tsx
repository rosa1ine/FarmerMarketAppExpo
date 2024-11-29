import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [senderId, setSenderId] = useState(null);
  const { receiverId: receiver, receiverName: name } = useRoute().params;
  console.log(receiver, name );
  const router = useRouter();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const fetchSenderId = async () => {
      const storedSenderId = await AsyncStorage.getItem('senderId');
      setSenderId(parseInt(storedSenderId, 10));
    };

    fetchSenderId();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!senderId) return;

      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in.');
          router.replace('/authentification/login');
          return;
        }

        const response = await fetch(
          `https://farmer-market-33zm.onrender.com/chat/get-messages/${senderId}/${receiver}/`,
          {
            method: 'GET',
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to fetch messages:', errorData);
          Alert.alert('Error', 'Failed to fetch messages. Please try again.');
          return;
        }

        const data = await response.json();
        setMessages(data.results || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'An unexpected error occurred while fetching messages.');
      }
    };

    fetchMessages();
  }, [senderId, receiver]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in.');
          router.replace('/authentification/login');
          return;
        }

        const messagePayload = {
          receiver,
          message: input.trim(),
          is_read: false,
        };

        const response = await fetch(
          'https://farmer-market-33zm.onrender.com/chat/send-messages/',
          {
            method: 'POST',
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(messagePayload),
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error('Failed to send message:', errorMessage);
        } else {
          const data = await response.json();
          console.log('Message sent successfully:', data);

          // Save new senderId if returned by the server
          if (data.sender && !senderId) {
            await AsyncStorage.setItem('senderId', data.sender.toString());
            setSenderId(data.sender);
          }

          // Update chat UI with new message
          setMessages((prevMessages) => [...prevMessages, data]);
          setInput('');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send the message.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.chatHeader}>
        <View style={styles.chatExpertInfo}>
          <Image
            style={styles.expertAvatar}
            source={{ uri: 'https://via.placeholder.com/40' }}
          />
          <View>
            <Text style={styles.expertName}>{name}</Text>
            <Text style={styles.onlineStatus}>Online Now</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.chatCloseBtn}>X</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
          contentContainerStyle={styles.chatMessages}
          keyboardShouldPersistTaps="handled">
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.chatMessage,
                message.sender === senderId
                  ? styles.userMessage // Message sent by you
                  : styles.expertMessage, // Message sent to you
              ]}
            >
              <Text>{message.message}</Text>
              <Text style={styles.chatTime}>
                {new Date(message.date).toLocaleTimeString()}
              </Text>
            </View>
          ))}
      </ScrollView>

      <View
        style={[
          styles.chatInputContainer,
          isKeyboardVisible ? styles.chatInputContainerKeyboardVisible : null,
        ]}
      >
        <TextInput
          style={styles.chatInput}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.chatSendButton} onPress={handleSendMessage}>
          <Text style={styles.chatSendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBlockEnd: 40,
    backgroundColor: '#fff',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3aaa58',
  },
  chatExpertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expertAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  expertName: {
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
    color: '#2d3f65',
  },
  onlineStatus: {
    fontSize: 12,
    color: 'green',
    paddingLeft: 10,
  },
  chatCloseBtn: {
    fontSize: 18,
    color: '#999',
  },
  chatMessages: {
    flexGrow: 1,
    padding: 20,
  },
  chatMessage: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#ffecec',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#fe724c',
  },
  expertMessage: {
    backgroundColor: '#e6ffe6',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#3aaa58',
  },
  chatTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3aaa58',
    borderRadius: 30,
  },
  chatInputContainerKeyboardVisible: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  chatInput: {
    flex: 1,
    padding: 8,
  },
  chatSendButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chatSendButtonText: {
    color: '#4caf50',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});

export default Chat;
