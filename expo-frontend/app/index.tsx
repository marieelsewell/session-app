import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useRouter, Stack } from "expo-router";
import CustomText from "../components/CustomText";
import BackgroundOmbre from "../components/BackgroundOmbre";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BackgroundOmbre topImageHeight={400} bottomImageHeight={300}>
        <View style={styles.container}>
          <CustomText style={styles.title}>Session.</CustomText>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push("/login")}>
            <CustomText style={styles.buttonText}>Login</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => router.push("/register")}>
            <CustomText style={styles.buttonText}>Register</CustomText>
          </TouchableOpacity>
        </View>
      </BackgroundOmbre>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    paddingBottom: 10, 
    color: '#703030', 
    textShadowColor: '#2f343b', 
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 2, 
    shadowOpacity: 0.02, 
  },
  buttonContainer: {
    backgroundColor: '#c77966', 
    borderWidth: 2, 
    borderColor: '#c77966', 
    borderRadius: 15, 
    marginBottom: 10, 
    width: 200, 
    height: 50,
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1, 
    shadowColor: '#2f343b', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, 
    shadowRadius: 3.84, 
    elevation: 5, 
  },
  buttonText: {
    color: '#703030', 
    fontSize: 20, 
  },
});

