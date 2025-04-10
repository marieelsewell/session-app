import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface BackgroundOmbreProps {
  topImageHeight: number;
  bottomImageHeight: number;
  children: React.ReactNode;
}

const BackgroundOmbre: React.FC<BackgroundOmbreProps> = ({ topImageHeight, bottomImageHeight, children }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/top-border-background.png')} style={[styles.topImage, { height: topImageHeight }]} />
      <Image source={require('../assets/images/bottom-border-background.png')} style={[styles.bottomImage, { height: bottomImageHeight }]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3cda4', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  bottomImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default BackgroundOmbre;
