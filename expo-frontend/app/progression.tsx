import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomText from "../components/CustomText";
import * as Tone from 'tone';
import * as Chord from '@tonaljs/chord';
import * as Key from '@tonaljs/key';
import { router } from 'expo-router';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

const ChordProgressionScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [progressionTitle, setProgressionTitle] = useState('Untitled');
  const [chords, setChords] = useState<string[]>([]);
  const [currentChord, setCurrentChord] = useState('C4');
  const [key, setKey] = useState('C');
  const [tempo, setTempo] = useState(120);
  const [rhythm, setRhythm] = useState('4n');
  const [savedProgressions, setSavedProgressions] = useState<{ chords: string[]; key: string; tempo: number; rhythm: string; }[]>([]);
  const [scaleType, setScaleType] = useState('major');
  const [chordOptions, setChordOptions] = useState<string[]>([]);

  // Update chord options based on key and scale type
  useEffect(() => {
    const keyData = scaleType === 'major' ? Key.majorKey(key) : Key.minorKey(key);
    const chordsInKey = (scaleType === 'major' ? keyData.chords : keyData.natural.chords)
      .map((chord: string) => `${chord}4`);
    setChordOptions(chordsInKey);
    if (!chordsInKey.includes(currentChord)) {
      setCurrentChord(chordsInKey[0] || 'C4');
    }
  }, [key, scaleType]);

  useEffect(() => {
    const fetchProgression = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/progression/${id}`);
        if (!response.ok) throw new Error('Failed to fetch progression');

        const progression = await response.json();
        setProgressionTitle(progression.title);
        setChords(JSON.parse(progression.chords));
        setKey(progression.key);
        setTempo(progression.tempo);
        setRhythm(progression.rhythm);
        setScaleType(progression.scaleType);
      } catch (error) {
        console.error('Error fetching progression:', error);
      }
    };

    if (id) fetchProgression();
  }, [id]);

  const playProgression = async () => {
    await Tone.start();
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    Tone.getTransport().bpm.value = tempo;

    let time = 0;
    chords.forEach((chord) => {
      const baseChord = chord.slice(0, -1);
      const octave = chord.slice(-1);
      const chordData = Chord.get(baseChord);
      const notes = chordData.notes.map((note) => `${note}${octave}`);
      
      if (notes.length > 0) {
        synth.triggerAttackRelease(notes, rhythm, `+${time}`);
        time += Tone.Time(rhythm).toSeconds();
      } else {
        console.warn(`Invalid chord: ${chord}`);
      }
    });

    Tone.getTransport().start();
    setTimeout(() => Tone.getTransport().stop(), time * 1000 + 100);
  };

  const addChord = () => {
    setChords([...chords, currentChord]);
  };

  const resetProgression = () => {
    setChords([]);
  };

  const saveProgression = async () => {
    const user = auth.currentUser;
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'You must be logged in to save a progression.',
      });
      return;
    }

    try {
      const firebaseUid = user.uid;
      const payload = {
        user_id: firebaseUid,
        title: progressionTitle,
        chords,
        key,
        tempo,
        rhythm,
        scaleType,
      };

      const url = id
        ? `http://localhost:8080/api/progression/${id}` 
        : 'http://localhost:8080/api/progression'; 

      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving progression:', errorData.error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to save progression: ' + errorData.error,
        });
        return;
      }

      const savedProgression = await response.json();
      console.log(id ? 'Progression updated successfully:' : 'Progression saved successfully:', savedProgression);
      Toast.show({
        type: 'success',
        text1: id ? 'Progression updated successfully!' : 'Progression saved successfully!',
      });
    } catch (error) {
      console.error('Error saving progression:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while saving the progression.',
      });
    }
  };

  const handleDeletePress = async () => {
    try {
      if (!id) return;

      const response = await fetch(`http://localhost:8080/api/progression/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete progression');
      }

      Toast.show({
        type: 'success',
        text1: 'Progression deleted successfully',
      });

      router.push('/home'); 
    } catch (error) {
      console.error('Error deleting progression:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete progression',
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
        value={progressionTitle}
        onChangeText={setProgressionTitle}

      />
      <View style={styles.pickersContainer}>
        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <CustomText>Key:</CustomText>
            <Picker
              selectedValue={key}
              onValueChange={(value) => setKey(value)}
              style={styles.picker}
            >
              {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((k) => (
                <Picker.Item label={k} value={k} key={k} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <CustomText>Scale Type:</CustomText>
            <Picker
              selectedValue={scaleType}
              onValueChange={(value) => setScaleType(value)}
              style={styles.picker}
            >
              <Picker.Item label="Major" value="major" />
              <Picker.Item label="Minor" value="minor" />
            </Picker>
          </View>
        </View>

        <CustomText>Tempo (BPM):</CustomText>
        <TextInput
          value={tempo.toString()}
          onChangeText={(text) => setTempo(Number(text) || 120)}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <CustomText>Rhythm:</CustomText>
            <Picker
              selectedValue={rhythm}
              onValueChange={(value) => setRhythm(value)}
              style={styles.picker}
            >
              <Picker.Item label="Quarter Note" value="4n" />
              <Picker.Item label="Eighth Note" value="8n" />
              <Picker.Item label="Half Note" value="2n" />
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <CustomText>Add Chord:</CustomText>
            <Picker
              selectedValue={currentChord}
              onValueChange={(value: string) => setCurrentChord(value)}
              style={styles.picker}
            >
              {chordOptions.map((chord: string) => (
                <Picker.Item label={chord} value={chord} key={chord} />
              ))}
            </Picker>
          </View>
        </View>
        <TouchableOpacity style={styles.addChordButton} onPress={addChord}>
          <CustomText style={styles.addChordButtonText}>Add Chord</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={playProgression}>
        <Image 
          source={require('../assets/images/play.png')} 
          style={styles.playButtonImage} 
        />
      </TouchableOpacity>
      <CustomText style={styles.chordProgressionText}>
        {chords.join(' -> ')}
      </CustomText>
      </View>
      <TouchableOpacity style={styles.restartButton} onPress={resetProgression}>
        <CustomText style={styles.restartButtonText}>Reset</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={saveProgression}>
        <CustomText style={styles.saveButtonText}>Save</CustomText>
      </TouchableOpacity>
      {id && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
          <CustomText style={styles.deleteButtonText}>Delete</CustomText>
        </TouchableOpacity>
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
  },
  picker: { 
    height: 50, 
    width: 150,
    marginBottom: 10,
    backgroundColor: '#E3CDA4',
    borderColor: '#703030',
    borderRadius: 10,
  },
  input: { 
    borderWidth: 1, 
    padding: 5, 
    marginBottom: 10, 
    width: 100,
    borderColor: '#703030',
    borderRadius: 10,
  },
  borderImage: {
    width: '100%',
    height: 100,
    zIndex: -1,
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
    zIndex: -1,
  },
  titleInput: {
    position: 'absolute',
    top: '14%',
    width: '80%',
    left: '10%',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 24,
    color: '#703030',
    zIndex: 2, 
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
  playButton: {
    width: 60,
    height: 60,
    zIndex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10, 
  },
  playButtonImage: {
    width: '100%',
    height: '100%',
  },
  pickersContainer: {
    paddingTop: 70,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  addChordButton: {
    backgroundColor: '#703030', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
    alignItems: 'center', 
  },
  addChordButtonText: {
    color: '#E3CDA4', 
    fontSize: 16, 
    fontWeight: 'bold', 

  },
  chordProgressionText: {
    fontSize: 18, 
    color: '#703030', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 10, 
    backgroundColor: 'transparent', 
    padding: 25, 
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

export default ChordProgressionScreen;