// Ensure ProfilePage is defined within a StackNavigator and the navigation prop is passed correctly
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const NotificationPage = () => {
  const navigation = useNavigation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setShowLoginModal(true);
  }, []);

  return (
    <View>
      <Text style={styles.label}>Đang tải thông báo...</Text>
      <Modal isVisible={showLoginModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Vui lòng đăng nhập</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => {
            setShowLoginModal(false);
            navigation.navigate('Welcome');
          }}>
            <Text style={{ color: 'white', fontSize: 18 }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 19,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#0f0ffa',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    width: '100%',
  },
});

export default NotificationPage;
