import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { auth } from "../firebaseConfig";
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const CreateLyric = () => {
  const [title, setTitle] = useState('New Lyric');
  const [content, setText] = useState('');
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchLyric = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/lyrics/${id}`);
        if (!response.ok) throw new Error('Failed to fetch progression');
  
        const lyric = await response.json();
        setTitle(lyric.title);
        setText(lyric.content);
      } catch (error) {
        console.error('Error fetching progression:', error);
      }
    };
  
    if (id) fetchLyric();
  }, [id]);

  const handleSavePress = async () => {
    try {
      const user = auth.currentUser;
      console.log('Current user:', user);
      if (!user) {
        console.error('No user is logged in');
        return;
      }

      const url = id 
        ? `http://localhost:8080/api/lyrics/${id}` 
        : 'http://localhost:8080/api/lyrics'; 

      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          title,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(id ? 'Failed to update lyric' : 'Failed to save lyric');
      }

      Toast.show({
        type: 'success',
        text1: id ? 'Lyric updated successfully' : 'Lyric saved successfully',
      });
    } catch (error) {
      console.error('Error saving lyric:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: id ? 'Failed to update lyric' : 'Failed to save lyric',
      });
    }
  };

  const handleDeletePress = async () => {
    try {
      if (!id) return;

      const response = await fetch(`http://localhost:8080/api/lyrics/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lyric');
      }

      Toast.show({
        type: 'success',
        text1: 'Lyric deleted successfully',
      });

      router.push('/home');
    } catch (error) {
      console.error('Error deleting lyric:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete lyric',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Type your lyrics here..."
        value={content}
        onChangeText={setText}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      {id && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#E3CDA4',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'normal',
    marginBottom: 20,
    color: '#703030',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#BDA272',
    textAlignVertical: 'top',
  },
  saveButton: {
    position: 'absolute',
    bottom: '5%',
    right: '10%',
    zIndex: 2,
  },
  saveButtonText: {
    fontSize: 18,
    color: '#703030',
  },
  deleteButton: {
    position: 'absolute',
    bottom: '5%',
    left: '10%',
    zIndex: 2,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#703030',
  },
});

export default CreateLyric;
