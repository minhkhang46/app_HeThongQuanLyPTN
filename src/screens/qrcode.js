import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import randomstring from 'randomstring'; // Import thư viện tạo mật khẩu ngẫu nhiên

const QRCodeScreen = ({ navigation, route }) => {
  const { ID_User, lab_name, quantity, registration_time, date } = route.params;
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  // Sinh mật khẩu ngẫu nhiên
  const password = randomstring.generate(8);

  // Tạo chuỗi JSON từ dữ liệu cùng với mật khẩu
  const dataToEncode = JSON.stringify({
    ID_User,
    lab_name,
    quantity,
    registration_time,
    date,
    password // Thêm mật khẩu vào dữ liệu
  });

  // Hàm để lưu QR code vào cơ sở dữ liệu và hiển thị thông báo lưu thành công
  const saveQRCodeToDatabase = async () => {
    try {
      // Lưu mã QR code vào cơ sở dữ liệu
      await axios.post('http://192.168.56.1:3000/qrdata', {
        qrdata: dataToEncode
      });
      setSuccessModalVisible(true);
    } catch (error) {
      console.error('Error saving QR code to database:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị mã QR */}
      <View style={styles.qrCodeContainer}>
        <QRCode value={dataToEncode} size={200} />
      </View>
      {/* Nút để lưu QR code */}
      <TouchableOpacity style={styles.saveButton} onPress={saveQRCodeToDatabase}>
        <Text style={styles.buttonText}>Lưu QR Code</Text>
      </TouchableOpacity>
      {/* Modal hiển thị thông báo lưu thành công */}
      {isSuccessModalVisible && (
        <View style={styles.modal}>
          <Text style={styles.modalText}>QR code đã được lưu thành công!</Text>
          <TouchableOpacity style={styles.okButton} onPress={() => {
            setSuccessModalVisible(false);
            navigation.navigate('Main');
          }}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeContainer: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#0f0ffa',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modal: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight:'bold',
  },
  okButton: {
    backgroundColor: '#0f0ffa',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
});

export default QRCodeScreen;
