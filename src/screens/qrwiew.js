import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';

const Header = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Main')}>
        <Image source={require('../../assets/left-arrow.png')} style={styles.headerIcon} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 19, textAlign: 'center', marginLeft: 10, fontWeight: 'bold', marginTop: 40 }}>Mã QR Đăng Ký</Text>
      </View>
    </View>
  );
};

const QRWievScreen = ({ navigation }) => {
  const [qrCodes, setQRCodes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // Lưu id đăng nhập người dùng hiện tại
  const [selectedQR, setSelectedQR] = useState(null); // Mã QR được chọn để hiển thị lớn hơn

  // Lấy id đăng nhập người dùng hiện tại
  useEffect(() => {
    axios.get('http://192.168.56.1:3000/profile')
      .then(response => {
        setCurrentUserId(response.data.macv); // Lưu id người dùng vào state
      })
      .catch(error => {
        console.error('Error fetching current user id:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://192.168.56.1:3000/qrdata')
      .then(response => {
        setQRCodes(response.data);
      })
      .catch(error => {
        console.error('Error fetching QR codes:', error);
      });
  }, []);

  //không hiển thị các mục trống
  const filteredQRCodes = qrCodes.filter(item => {
    const qrDataObject = JSON.parse(item.qr_data);
    const userID = qrDataObject.ID_User;
    return currentUserId === userID;
  });
  
  const renderItem = ({ item }) => {
    // Phân tích chuỗi JSON trong qr_data để lấy giá trị ID_User
    const qrDataObject = JSON.parse(item.qr_data);
    
    // Lấy giá trị ID_User từ đối tượng phân tích
    const userID = qrDataObject.ID_User;
    
    //lấy giá trị date 
    const dateqr = qrDataObject.date;
    // Kiểm tra xem userID có giống với currentUserId không
    const isCurrentUserQR = currentUserId === userID;
  
    return (
      <TouchableOpacity onPress={() => setSelectedQR(item.qr_data)}>
        <View>
          <View style={styles.itemContainer}>
            {isCurrentUserQR && (
              <View style={styles.row}>
                <QRCode value={item.qr_data} size={100} />
                <View style={styles.info}>
                  <Text>Ngày : {dateqr}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <FlatList
        data={filteredQRCodes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* //chỗ lam lon mã qr */}
      {selectedQR && (
        <>
          <View style={styles.modalBackground} />
          <View style={styles.qrModal}>
            <QRCode value={selectedQR} size={250} />
            <TouchableOpacity onPress={() => setSelectedQR(null)}>
              <Text style={styles.closeButton}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A1DCFF',
  },
  header: {
    marginBottom: -2,
    flexDirection: 'row', 
    padding: 5,
    backgroundColor:'white'
  },
  headerIcon: {
    marginLeft: 10,
    width: 30,
    height: 30,
    resizeMode: 'contain',
    fontWeight: "bold",
    marginTop: 40
  },
  itemContainer: {
    borderRadius: 20,
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f0f0f0',
    width: '90%',
    marginLeft: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  info: {
    marginLeft: 10,
  },
  qrModal: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalBackground: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeButton: {
    marginTop: 20,
    color: '#0f0ffa',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default QRWievScreen;
