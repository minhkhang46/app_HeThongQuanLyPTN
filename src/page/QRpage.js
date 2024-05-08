import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import Modal from 'react-native-modal';

const Header = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
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
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  useEffect(() => {
    
    // Show login modal if there are no QR codes for the current user
    const timer = setTimeout(() => {
      if (qrCodes.length === 0) {
     
        setShowLoginModal(false);
      } else {
        setShowLoginModal(true);
      }
    }, 100); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, [qrCodes]);
  
  const renderItem = ({ item }) => {
    const qrDataObject = JSON.parse(item.qr_data);
    const userID = qrDataObject.ID_User;
    const dateqr = qrDataObject.date;
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
        data={qrCodes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <Modal isVisible={showLoginModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Vui Lòng Đăng Nhập</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => {setShowLoginModal(false); navigation.navigate('Welcome'); }}>
            <Text style={{ color: 'white', fontSize: 18 }}>Đóng</Text>
            </TouchableOpacity>
        </View>
      </Modal>
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
        fontWeight:'bold',
      },
      modalButton: {
        backgroundColor: '#4F46E5',
        padding: 12,
        alignItems: 'center',
        borderRadius: 4,
        width: '100%',
      },
    });

export default QRWievScreen;
