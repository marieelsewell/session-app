import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import CustomText from "../components/CustomText";
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

const Recording = () => {
  const navigation = useNavigation();
  const { id, data } = useLocalSearchParams();
  const recordingData = data ? JSON.parse(data) : null;

  const [recordingTitle, setRecordingTitle] = useState(recordingData?.title || 'Untitled');
  const [duration, setDuration] = useState(recordingData?.duration || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      if (recordingData?.file_path) {
        const { sound } = await Audio.Sound.createAsync({ uri: recordingData.file_path });
        setSound(sound);
        setIsPlaying(false);
      }
    };
    loadSound();

    return () => {
      sound?.unloadAsync();
    };
  }, [recordingData]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/recordings/${id}`);
        if (!response.ok) throw new Error('Failed to fetch recording');

        const recording = await response.json();
        console.log('Fetched recording:', recording);
        setRecordingTitle(recording.title);
        setDuration(recording.duration);
        if (recording.file_path) {
          const filePath = `http://localhost:8080${recording.file_path}`; 
          const { sound } = await Audio.Sound.createAsync({ uri: filePath });
          setSound(sound);
        }
      } catch (error) {
        console.error('Error fetching recording:', error);
      }
    };

    if (id) fetchRecording();
  }, [id]);

  const handleRecordPress = async () => {
    if (isRecording) {
      setIsRecording(false);
      await recording?.stopAndUnloadAsync();
      const soundObject = await recording?.createNewLoadedSoundAsync();
      if (soundObject && soundObject.sound) {
        setSound(soundObject.sound);
      }
      if (recording) {
        //console.log('Recording file:', recording.getURI());
      }
      clearInterval(intervalRef.current!);
      //console.log('Recording stopped, sound set:', soundObject?.sound);
    } else {
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording); 
      setTimer(0);
      intervalRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
      console.log('Recording started');
    }
  };

  const handlePlayPausePress = async () => {
    if (isPlaying) {
      await sound?.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound?.playAsync();
      setIsPlaying(true);
      sound?.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          if (status.durationMillis !== undefined) {
            setDuration(status.durationMillis);
          }
        }
      });
    }
  };

  const handleSliderChange = async (value: number) => {
    await sound?.setPositionAsync(value);
  };

  const handleRestartPress = () => {
    setRecordingTitle('Untitled');
    setIsRecording(false);
    setRecording(null);
    setSound(null);
    setIsPlaying(false);
    setDuration(0);
    setPosition(0);
    setTimer(0);
    clearInterval(intervalRef.current!);
  };

  const handleSavePress = async () => {
    if (!recording || !recording.getURI()) {
      console.error('No recording to save');
      return;
    }
  
    try {
      const fileUri = recording.getURI();
  
      if (Platform.OS !== 'web') {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          console.error('File does not exist at URI:', fileUri);
          return;
        }
      }
  
      const formData = new FormData();
  
      if (Platform.OS === 'web') {
        // For web, fetch the file as a Blob
        const response = await fetch(fileUri);
        const blob = await response.blob();
        formData.append('file_path', blob, `${recordingTitle}.m4a`);
      } else {
        // For native platforms, use the file URI
        formData.append('file_path', {
          uri: fileUri,
          name: `${recordingTitle}.m4a`, 
          type: 'audio/m4a', 
        });
      }
  
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }
  
      formData.append('userId', user.uid);
      formData.append('duration', duration.toString());
      formData.append('title', recordingTitle);
  
      console.log('FormData contents:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
  
      const response = await fetch('http://localhost:8080/api/recordings/upload', {
        method: 'POST',
        body: formData,
        headers: {
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Recording saved:', data);
        Toast.show({
          type: 'success',
          text1: 'Recording saved successfully!',
        });
      } else {
        const error = await response.json();
        console.error('Error saving recording:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save recording.',
        });
      }
    } catch (error) {
      console.error('Error saving recording:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while saving the recording.',
      });
    }
  };

  const handleDeletePress = async () => {
    try {
      if (!id) return;

      const response = await fetch(`http://localhost:8080/api/recordings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete recording');
      }

      Toast.show({
        type: 'success',
        text1: 'Recording deleted successfully',
      });

      router.push('/home'); 
    } catch (error) {
      console.error('Error deleting recording:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete recording',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/top-border-background.png')} style={styles.borderImage} />
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
        <Image source={require('../assets/images/back.png')} style={styles.backButtonImage} />
      </TouchableOpacity>
      
      <TextInput
        style={[styles.titleInput, { fontFamily: CustomText.fontFamily }]}
        value={recordingTitle}
        onChangeText={setRecordingTitle}
      />
      
      <TouchableOpacity style={styles.recordButton} onPress={handleRecordPress}>
        <Image 
          source={isRecording ? require('../assets/images/while-recording.png') : require('../assets/images/record-button.png')} 
          style={styles.recordButtonImage} 
        />
      </TouchableOpacity>

      {isRecording && (
        <Image source={require('../assets/images/audioanimation.gif')} style={styles.recordingGif} />
      )}

      {!isRecording && sound && (
        <>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#703030" 
            maximumTrackTintColor="#bda272" 
            thumbTintColor="#703030" 
          />
          <Text style={styles.timer}>{new Date(position).toISOString().substr(14, 5)}</Text>
          <TouchableOpacity style={styles.playPauseButton} onPress={handlePlayPausePress}>
            <Image 
              source={isPlaying ? require('../assets/images/pause.png') : require('../assets/images/play.png')} 
              style={styles.playPauseButtonImage} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.restartButton} onPress={handleRestartPress}>
            <Text style={styles.restartButtonText}>Restart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          {id && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <Image source={require('../assets/images/recording-bottom-border.png')} style={styles.bottomBorderImage} />
    </View>
  );
};

import { Dimensions } from 'react-native';
import { auth } from '@/firebaseConfig';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3CDA4',
  },
  borderImage: {
    width: '100%',
    height: 100,
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    width: 30,
    height: 30,
    zIndex: 2,
  },
  backButtonImage: {
    width: '100%',
    height: '100%',
  },
  bottomBorderImage: {
    width: '100%',
    height: '40%',
    position: 'absolute',
    bottom: 0,
  },
  recordButton: {
    position: 'absolute',
    bottom: '10%',
    width: 120,
    height: 120,
    left: screenWidth / 2 - 60,
    zIndex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  recordButtonImage: {
    width: '100%',
    height: '100%',
  },
  titleInput: {
    position: 'absolute',
    top: '14%',
    width: '80%',
    left: '10%',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 24,
    color:'#703030'
  },
  recordingGif: {
    position: 'absolute',
    bottom: '45%',
    width: 300,
    height: 300,
    left: screenWidth / 2 - 150,
    zIndex: 1,
  },
  slider: {
    position: 'absolute',
    bottom: '50%',
    width: '80%',
    left: '10%',
    zIndex: 2,
  },
  timer: {
    position: 'absolute',
    bottom: '55%',
    left: '10%',
    fontSize: 18,
    color: '#703030',
    zIndex: 2,
  },
  playPauseButton: {
    position: 'absolute',
    bottom: '42%',
    width: 60,
    height: 60,
    left: screenWidth / 2 - 30,
    zIndex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  playPauseButtonImage: {
    width: '100%',
    height: '100%',
  },
  restartButton: {
    position: 'absolute',
    bottom: '5%',
    left: '10%',
    zIndex: 2,
  },
  restartButtonText: {
    fontSize: 18,
    color: '#703030',
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
    left: '45%',
    zIndex: 2,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#703030',
  },
});

export default Recording;
