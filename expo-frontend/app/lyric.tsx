import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import CreateLyric from '@/components/create-lyric';

const Lyric = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/top-border-background.png')} style={styles.borderImage} />
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
        <Image source={require('../assets/images/back.png')} style={styles.backButtonImage} />
      </TouchableOpacity>
        <CreateLyric />
    </View>
  );
};

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
});

export default Lyric;
