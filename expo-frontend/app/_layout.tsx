import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import Toast from 'react-native-toast-message'; // Import Toast

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'CustomFont': require('../assets/fonts/Lexend_Deca/LexendDeca-VariableFont_wght.ttf'), 
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false, contentStyle: styles.screen }} />
      <Toast /> {}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3cda4", 
  },
  screen: {
    flex: 1,
    backgroundColor: "#e3cda4", 
  },
});
