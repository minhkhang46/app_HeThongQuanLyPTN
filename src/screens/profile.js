import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation(); // Lấy đối tượng navigation từ hook useNavigation

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Gửi yêu cầu HTTP GET để lấy thông tin người dùng từ endpoint
    axios.get('http://192.168.56.1:3000/profile')
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      // Xóa token hoặc thông tin đăng nhập khỏi bộ nhớ cục bộ
      await AsyncStorage.removeItem('token');

      // Điều hướng người dùng đến màn hình đăng nhập
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View>
      {userInfo ? (
        <View style={styles.item}>
          <Image
            source={require('../../assets/user.png')}
            style={styles.user}
          />
          <Text style={styles.label}>Tên: {userInfo.name}</Text>
          <Text style={styles.label}>Mã Số: {userInfo.macv}</Text>
          <Text style={styles.label}>Email: {userInfo.email}</Text>
        </View>
      ) : (
        <Text>Đang tải thông tin người dùng...</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 200,
  },
  user: {
    width: 75,
    height: 75,
    marginBottom: 10,
  },
  label: {
    fontSize: 19,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 160,
    width: '90%',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0f0ffa', // Màu nền của nút (đổi màu nền)
  },
  logoutButtonText: {
    color: '#FFFFFF', // Màu chữ
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 20,
  },
});

export default ProfileScreen;
