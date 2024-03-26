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

const CodeScreen = ({ navigation }) => {
  const [qrCodes, setQRCodes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // Lưu id đăng nhập người dùng hiện tại
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày được chọn

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

  // Lọc dữ liệu theo ngày được chọn
  const filteredQRCodes = qrCodes.filter(item => {
    const qrDataObject = JSON.parse(item.qr_data);
    const userID = qrDataObject.ID_User;
    const dateqr = qrDataObject.date;
    return currentUserId === userID && dateqr === selectedDate; // Lọc theo cả ngày và người dùng
  });
  
  const renderItem = ({ item }) => {
    const qrDataObject = JSON.parse(item.qr_data);
    const userID = qrDataObject.ID_User;
    const dateqr = qrDataObject.date;
    const isCurrentUserQR = currentUserId === userID;
  
    return (
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
    );
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      {/* Hiển thị picker để chọn ngày */}
      <FlatList
        data={filteredQRCodes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
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
});

export default CodeScreen;
