import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [macv, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleLogin = () => {
      if (!macv || !password) {
        setError('Vui lòng nhập mã số và mật khẩu');
        setShowModal(true);
        return;
      }
    
      axios.post('http://192.168.56.1:3000/users', { macv, password })
      .then(response => {
        const { success, message } = response.data;
        if (success) {
          setShowSuccessModal(true); // Hiển thị modal khi đăng nhập thành công
          setTimeout(() => {
            setShowSuccessModal(false); // Đóng modal sau 3 giây
            navigation.navigate('Main'); // Chuyển hướng người dùng đến màn hình tiếp theo
            setPassword(''); // Xóa mật khẩu sau khi chuyển hướng đến Main
          }, 1000); // Đợi 3 giây trước khi tự động đóng modal
        } else {
          if (message) {
            setError(message);
          } else {
            setError('Đăng nhập không thành công. Vui lòng thử lại sau.');
          }
          setShowModal(true);
        }
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi khi đăng nhập:', error);
        setError('Mã số hoặc mật khẩu không chính xác');
        setShowModal(true);
      });
    
    
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Xin chào!</Text>
      <Text style={styles.h}>Chào mừng bạn đến</Text>
   
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo1.png')} style={styles.logo} />
      </View>
      
      <View style={styles.passwordInputContainer}>
        <Image source={require('../../assets/profile-user.png')} style={styles.icon1} />
        <TextInput
          style={styles.input}
          placeholder="Nhập mã số"
          onChangeText={(text) => setUsername(text)}
          value={macv}
        />
      </View>
      
      <View style={styles.passwordInputContainer}>
         <Image source={require('../../assets/padlock.png')} style={styles.icon1} />   
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIconContainer}>
          <Image
            source={showPassword ? require('../../assets/eye.png') : require('../../assets/crossed-eye.png')}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{error}</Text>
            <Button title="Đóng" onPress={() => setShowModal(false)} color="#0f0ffa" />
          </View>
        </View>
      </Modal>

      {/* Modal hiển thị khi đăng nhập thành công */}
      <Modal
        visible={showSuccessModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalText1}>Đăng nhập thành công!</Text>
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#A1DCFF',
  },
  h: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: -10,
    marginRight: 130,
  },
  h1: {
    fontSize: 23,
    fontWeight: 'bold',
    marginRight: 240,
    marginBottom:  2,
  },
  input: {
    marginBottom: 10,
    marginTop: 2,
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white', // Màu nền của TextInput
  },
  loginButton: {
    marginTop: 12,
    backgroundColor: '#0f0ffa',
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    width: '90%',
    borderRadius: 10,
    height: 40,
    marginLeft: 35,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    paddingTop: 5,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -95,
    marginTop: -125,
  },
  logo: {
    width: 400, // Đặt kích thước hình ảnh theo ý muốn của bạn
    height: 400,
    // marginTop: 10,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent1: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    marginLeft: 5,
    height: '11%'
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginLeft: 15,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight:'bold'
  },

  modalText1: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight:'bold',
    alignItems:'center',
    marginTop: 12,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 8,
    top: '25%'
  },
  eyeIcon: {
    width: 25,
    height: 25,
    tintColor: 'gray',
  },
  icon1:{
    width: 35,
    height: 35,
    top: -5,
    right: 6,
  },
});

export default LoginScreen;
