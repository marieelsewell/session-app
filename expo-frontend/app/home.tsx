import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SectionList, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../components/CustomText';
import ListItem from '../components/itemCard';
import { router } from 'expo-router';
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:8080/api/users/auth/${user.uid}`);
          if (!response.ok) throw new Error("Failed to fetch user ID");

          const userData = await response.json();
          setUserId(userData.id);
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      } else {
        console.error("No user is logged in");
        setUserId(null);
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const [recordingsRes, progressionsRes, lyricsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/recordings/user/${userId}`),
          fetch(`http://localhost:8080/api/progression/user/${userId}`),
          fetch(`http://localhost:8080/api/lyrics/user/${userId}`),
        ]);

        if (!recordingsRes.ok || !progressionsRes.ok || !lyricsRes.ok) {
          throw new Error("Failed to fetch user data");
        }

        const [recordings, progressions, lyrics] = await Promise.all([
          recordingsRes.json(),
          progressionsRes.json(),
          lyricsRes.json(),
        ]);

        const combinedData = [
          ...recordings.map(item => ({ ...item, type: "recording" })),
          ...progressions.map(item => ({ ...item, type: "progression" })),
          ...lyrics.map(item => ({ ...item, type: "lyric" })),
        ];

        const sortedData = combinedData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleItemPress = async (item) => {
    if (item.type === 'progression') {
        router.push({
            pathname: '/progression',
            params: { id: item.id },
        });
    } else if (item.type === 'recording') {
        router.push({
            pathname: '/recording',
            params: { id: item.id },
        });
    } else {
        router.push({
            pathname: '/lyric',
            params: { id: item.id },
        });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const groupDataByDate = (data) => {
    const sections = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      'Previous 30 Days': [],
    };

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const twoDays = 2 * oneDay;
    const sevenDays = 7 * oneDay;
    const thirtyDays = 30 * oneDay;

    data.forEach(item => {
      const diff = now - new Date(item.updatedAt);
      if (diff < oneDay) {
        sections.Today.push(item);
      } else if (diff < twoDays) {
        sections.Yesterday.push(item);
      } else if (diff < sevenDays) {
        sections['Previous 7 Days'].push(item);
      } else if (diff < thirtyDays) {
        sections['Previous 30 Days'].push(item);
      } else {
        const year = new Date(item.updatedAt).getFullYear();
        if (!sections[year]) {
          sections[year] = [];
        }
        sections[year].push(item);
      }
    });

    const orderedSections = [
      { title: 'Today', data: sections.Today },
      { title: 'Yesterday', data: sections.Yesterday },
      { title: 'Previous 7 Days', data: sections['Previous 7 Days'] },
      { title: 'Previous 30 Days', data: sections['Previous 30 Days'] },
      ...Object.keys(sections)
        .filter(key => !['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days'].includes(key))
        .sort((a, b) => a - b)
        .map(year => ({ title: year, data: sections[year] })),
    ].filter(section => section.data.length > 0);

    return orderedSections;
  };

  const sections = groupDataByDate(data);

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Sessions</CustomText>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <CustomText style={styles.logoutButtonText}>Logout</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Image source={require('../assets/images/add.png')} style={styles.addButtonImage} />
      </TouchableOpacity>
      <SectionList
        sections={sections}
        keyExtractor={(item) => `${item.type}-${item.id}`} 
        renderItem={({ item }) => (
          <ListItem item={item} onPress={() => handleItemPress(item)} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <CustomText style={styles.sectionHeader}>{title}</CustomText>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/progression')}>
                  <CustomText style={styles.modalText}>Chord Progression</CustomText>
                  <Image source={require('../assets/images/chord_progressioninvert.png')} style={styles.modalButtonImage} />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/recording')}>
                  <CustomText style={styles.modalText}>Audio Recording</CustomText>
                  <Image source={require('../assets/images/recordinginvert.png')} style={styles.modalButtonImage} />
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/lyric')}>
                  <CustomText style={styles.modalText}>Lyrics</CustomText>
                  <Image source={require('../assets/images/lyricinvert.png')} style={styles.modalButtonImage} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#703030'
  },
  sectionHeader: {
    fontSize: 16,
    color: '#703030',
    fontWeight: 'normal',
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#E3CDA4',
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    top: 70, 
    right: 10,
    width: 35,
    height: 35,
  },
  addButtonImage: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(199, 121, 102, 0.1)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#C77966',
    borderRadius: 10,
    alignItems: 'left',
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modalText: {
    fontSize: 18,
    color: '#FBE9C9',
    marginVertical: 10,
  },
  modalButtonImage: {
    width: 30,
    height: 30,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#FBE9C9',
    marginVertical: 5,
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#C77966',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FBE9C9',
    fontSize: 16,
  },
});

export default Home;

