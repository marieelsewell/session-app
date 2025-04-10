import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CustomText from './CustomText';

const ItemCard = ({ item, onPress }) => {
  const renderContent = () => {
    switch (item.type) {
      case 'session':
        return (
          <>
            <CustomText style={styles.title}>{item.name}</CustomText>
            <Image source={require('../assets/images/session.png')} style={styles.image} />
          </>
        );
      case 'recording':
        return (
          <>
            <CustomText style={styles.title}>{item.title}</CustomText>
            <Image source={require('../assets/images/recording.png')} style={styles.image} />
          </>
        );
      case 'lyric':
        return (
          <>
            <CustomText style={styles.title}>{item.title}</CustomText>
            <Image source={require('../assets/images/lyric.png')} style={styles.image} />
          </>
        );
      case 'progression':
        return (
          <>
            <CustomText style={styles.title}>{item.title}</CustomText>
            <Image source={require('../assets/images/chord_progression.png')} style={styles.image} />
          </>
        );
      default:
        return <Text>Unknown item type</Text>;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 5 },
  card: {
    backgroundColor: '#FBE9C9',
    padding: 8,
    paddingLeft: 16,
    borderRadius: 8,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, 
  },
  title: { fontSize: 15, fontWeight: 'light', color: '#703030' },
  image: { width: 50, height: 50 },
});

export default ItemCard;