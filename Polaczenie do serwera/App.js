import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = 'https://api.jsonplaceholder.dev/posts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('');
  const [sending, setSending] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Nie udało się pobrać danych');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!title.trim() || !body.trim() || !userId.trim()) {
      Alert.alert('Błąd', 'Wypełnij wszystkie pola formularza.');
      return;
    }

    setSending(true);
    setServerResponse(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          userId: Number(userId),
        }),
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const data = await response.json();
      setServerResponse(data);
      setTitle('');
      setBody('');
      setUserId('');
      Alert.alert('Sukces', 'Post został wysłany pomyślnie!');
    } catch (err) {
      Alert.alert('Błąd', err.message || 'Nie udało się wysłać danych');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postId}>#{item.id}</Text>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <Text style={styles.header}>Połączenie z serwerem</Text>

      {/* Formularz */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Dodaj nowy post</Text>
        <TextInput
          style={styles.input}
          placeholder="Tytuł"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Treść"
          placeholderTextColor="#999"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={3}
        />
        <TextInput
          style={styles.input}
          placeholder="ID użytkownika"
          placeholderTextColor="#999"
          value={userId}
          onChangeText={setUserId}
          keyboardType="numeric"
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            sending && styles.buttonDisabled,
          ]}
          onPress={createPost}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Wyślij</Text>
          )}
        </Pressable>

        {serverResponse && (
          <View style={styles.responseBox}>
            <Text style={styles.responseTitle}>Odpowiedź serwera:</Text>
            <Text style={styles.responseText}>
              {JSON.stringify(serverResponse, null, 2)}
            </Text>
          </View>
        )}
      </View>

      {/* Lista postów */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Lista postów</Text>
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#4a90d9" />
            <Text style={styles.loadingText}>Ładowanie danych...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorText}>Błąd: {error}</Text>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={fetchPosts}
            >
              <Text style={styles.buttonText}>Spróbuj ponownie</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPost}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4a90d9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    backgroundColor: '#a0c4e8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  responseBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  responseTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#2e7d32',
  },
  responseText: {
    fontSize: 12,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#666',
  },
  errorText: {
    fontSize: 15,
    color: '#e74c3c',
    marginBottom: 12,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  postId: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  postBody: {
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },
});
