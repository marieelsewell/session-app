import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import CustomText from "./CustomText";
import { auth } from "../firebaseConfig";

export default function AuthForm({ isRegister = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(null); 
  const [alertType, setAlertType] = useState("error"); 
  const router = useRouter();

  const saveUserToDatabase = async (userId, email) => {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user to the database");
      }
    } catch (error) {
      console.error("Error saving user to database:", error);
      setAlertMessage("Failed to save user to the database.");
      setAlertType("error");
    }
  };

  const showAlert = (type, message) => {
    setAlertType(type); // "error" or "success"
    setAlertMessage(message);
  };

  const handleSubmit = async () => {
    if (isRegister && password !== confirmPassword) {
      showAlert("error", "Passwords do not match!");
      return;
    }

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        try {
          await saveUserToDatabase(userId, email);
          showAlert("success", "Registered successfully!");
        } catch (backendError) {
          console.error("Backend error:", backendError);
          showAlert("warning", "Registered successfully, but failed to save user to the database.");
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showAlert("success", "Logged in successfully!");
      }

      router.push("/home");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/user-disabled":
            errorMessage = "This user account has been disabled.";
            break;
          case "auth/user-not-found":
            errorMessage = "No user found with this email.";
            break;
          case "auth/missing-password":
            errorMessage = "You must enter a password.";
            break;
          case "auth/invalid-credential":
            errorMessage = "Incorrect password.";
            break;
          case "auth/email-already-in-use":
            errorMessage = "This email is already in use.";
            break;
          case "auth/password-does-not-meet-requirements":
            errorMessage = "Password is too weak.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      console.error(error);
      showAlert("error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}

      {/* Display the alert message */}
      {alertMessage && (
        <Text style={[styles.alertMessage, alertType === "error" ? styles.errorText : styles.successText]}>
          {alertMessage}
        </Text>
      )}

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
        <CustomText style={styles.buttonText}>{isRegister ? "Register" : "Login"}</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#7e827a",
    width: 250,
  },
  alertMessage: {
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
  errorText: {
    color: "red",
  },
  successText: {
    color: "green",
  },
  buttonContainer: {
    backgroundColor: "#c77966",
    borderWidth: 2,
    borderColor: "#c77966",
    borderRadius: 15,
    marginBottom: 10,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#2f343b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#703030",
    fontSize: 20,
  },
});

