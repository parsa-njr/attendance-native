import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const messagesInitial = [
  { id: '1', text: 'سلام، خوبی؟', fromMe: false },
  { id: '2', text: 'مرسی عزیز، تو خوبی؟', fromMe: true },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(messagesInitial);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      fromMe: true,
    };
    setMessages([newMessage, ...messages]);
    setInputText('');
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageRow, item.fromMe ? styles.messageOut : styles.messageIn]}>
      {!item.fromMe && (
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
          style={styles.avatar}
        />
      )}
      <View style={[styles.bubble, item.fromMe ? styles.bubbleOut : styles.bubbleIn]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
              style={styles.headerAvatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.headerName}>گروه برنامه‌نویسی</Text>
              <Text style={styles.headerStatus}>آنلاین</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#444" />
            </TouchableOpacity>
          </View>

          {/* Chat List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            inverted
            contentContainerStyle={{ padding: 12 }}
          />

          {/* Input Area */}
          <View style={styles.inputBox}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="mic-outline" size={22} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="attach-outline" size={22} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="پیام بنویسید..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
  },
  headerAvatar: {
    width: 44, height: 44, borderRadius: 22, marginRight: 12,
  },
  headerName: {
    fontWeight: 'bold', fontSize: 17, color: '#222',
  },
  headerStatus: {
    fontSize: 12, color: 'green', marginTop: 2,
  },

  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  messageIn: {
    alignSelf: 'flex-start',
  },
  messageOut: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 28, height: 28, borderRadius: 14, marginHorizontal: 6,
  },
  bubble: {
    padding: 10,
    borderRadius: 14,
    maxWidth: '75%',
  },
  bubbleIn: {
    backgroundColor: '#eee',
  },
  bubbleOut: {
    backgroundColor: '#cef5d6',
  },
  messageText: {
    fontSize: 15, color: '#333',
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  iconBtn: {
    padding: 6,
    marginHorizontal: 2,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 15,
    maxHeight: 100,
    marginHorizontal: 6,
  },
  sendBtn: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 20,
    marginLeft: 4,
  },
});

export default ChatScreen;
