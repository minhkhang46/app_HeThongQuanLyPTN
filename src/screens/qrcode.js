import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import randomstring from 'randomstring'; // Import thư viện tạo mật khẩu ngẫu nhiên

const QRCodeScreen = ({ navigation, route }) => {
  const { ID_User, lab_name, quantity, registration_time, date } = route.params;
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const removeBracketsAndQuotes = (jsonString) => {
    // Sử dụng biểu thức chính quy để thay thế dấu {} và "" bằng chuỗi trống
    const cleanedString = jsonString.replace(/[{}"]/g, '');
    const stringWithSpaces = cleanedString.replace(/,/g, ', ');
    const stringSpaces = stringWithSpaces.replace(/:/g, ': ');
    return stringSpaces;
  };
  // Tạo đối tượng chỉ chứa các giá trị mà bạn muốn hiển thị
  const Data = {
    ID_User,
    lab_name,
    quantity,
    registration_time,
    date
  };
  const dataqr = JSON.stringify(Data);
  // // Lấy chỉ các giá trị từ đối tượng qrData
  // const qrDataValues = Object.values(qrData);

  // // Xóa dấu ngoặc kép và dấu phẩy từ mảng qrDataValues và kết hợp chúng thành một chuỗi
  // const dataToEncode = qrDataValues.map(value => value.replace(/"/g, '')).join(', ');
  const qrData = {
    Mã_Số: ID_User, // Thay thế ID_User thành ma_so
    Phòng: lab_name,
    Số_Người: quantity,
    Thời_Gian: registration_time,
    Ngày: date,
   
  };
  
  //Chuyển đổi thành chuỗi JSON
  const data = JSON.stringify(qrData);
  const cleanedData = removeBracketsAndQuotes(data);
  // Hàm để lưu QR code vào cơ sở dữ liệu và hiển thị thông báo lưu thành công
  const saveQRCodeToDatabase = async () => {
    try {
    
  
      // Lưu mã QR code vào cơ sở dữ liệu
      await axios.post('http://192.168.56.1:3000/qrdata', {
        qrdata: dataqr
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
        <QRCode value={cleanedData} size={200} />
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
