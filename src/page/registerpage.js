import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Modal from 'react-native-modal';



const RegisterPage = ({ navigation }) => {
  const [ID_User, setID_User] = useState('');
  const [full_name, setFull_name] = useState('');
  const [email, setEmail] = useState('');
  const [lab_name, setLab_name] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [registration_time, setRegistration_time] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [labOptions, setLabOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);

  const [showLoginModal, setShowLoginModal] = useState(false); // Sửa thành false để modal không hiển thị mặc định


  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US');
  };
  useEffect(() => {
    setShowLoginModal(true);    

}, []);

const handleCloseLoginModal = () => {
    // Đóng modal khi người dùng nhấn vào nút Đóng
    navigation.navigate('Welcome');
    setShowLoginModal(false);
  };
const handleWelcome = () => {
    // Thực hiện xử lý đăng ký tại đây (ví dụ: gửi dữ liệu đăng ký đến server)

    // Sau khi đăng ký thành công, bạn có thể điều hướng tới trang khác
    navigation.navigate('Welcome');
  };

  
  

  return (
    <View>
      <View style={styles.header}>
      <TouchableOpacity onPress={handleWelcome}>
            {/* Icon menu của bạn */}
          <Image source={require('../../assets/left-arrow.png')} style={styles.headerIcon} />
        </TouchableOpacity> 
     
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 19, textAlign: 'center', marginLeft: 10, fontWeight: 'bold' }}>Đăng ký phòng thí nghiệm</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.pagecontainer}>
            <Text style={styles.text}>Thông tin đăng ký</Text>
            <Text style={styles.text}>(Vui lòng điền tất cả)</Text>
            
            <Text style={styles.label}>Mã số:</Text>
            <TextInput
              style={[styles.input, styles.disabledTextInput]}
              placeholder="Nhập mã số"
              onChangeText={setID_User}
              value={ ID_User}
              editable={false} 
            />
            <Text style={styles.label}>Họ và Tên:</Text>
            <TextInput
              style={[styles.input, styles.disabledTextInput]}
              placeholder="Nhập tên"
              onChangeText={setFull_name}
              value={full_name}
              editable={false} 
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={[styles.input, styles.disabledTextInput]}
              placeholder="Nhập email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              editable={false} 
            />
            <Text style={styles.label}>Chọn phòng thí nghiệm</Text>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                onValueChange={setLab_name}
                items={labOptions} // Truyền labOptions thay vì fetchLabData
                value={lab_name}
                placeholder={{
                  label: 'Chọn phòng thí nghiệm...',
                  value: null,
                }}
              />
            </View>
            <Text style={styles.label}>Tổng số người (tối đa 10 người)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tổng số từ 1 đến 10"
              onChangeText={setQuantity}
              value={quantity}
              keyboardType="numeric"
            />
            <Text style={styles.label}>Thời gian đăng ký</Text>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                onValueChange={setRegistration_time}
                items={timeOptions}
                value={registration_time}
                placeholder={{
                  label: 'Chọn thời gian đăng ký',
                  value: null,
                }}
              />
            </View>
            <Text style={styles.label}>Ngày đăng ký</Text>
   
              <TouchableOpacity style={styles.inputContainer} onPress={showDatePickerModal}>
                <Text>{date ? formatDate(date) : 'Chọn ngày'}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}

            <TouchableOpacity style={styles.registerButton} >
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
        <Modal isVisible={showLoginModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Vui Lòng Đăng Nhập</Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleCloseLoginModal}>
            <Text style={{ color: 'white' ,fontSize: 18}}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
      },

  header: {
    marginTop: 40,
    marginBottom: -2,
    flexDirection: 'row', 
    padding: 5
  },

  disabledTextInput: {
    color: 'black', // Đảm bảo màu chữ là đen
    pointerEvents: 'none' // Ngăn người dùng tương tác với TextInput
  },

  headerIcon:{
    marginLeft: 10,
    width: 30,
    height: 30,
    resizeMode: 'contain',
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 16,
    backgroundColor: '#A1DCFF',
  },
  pagecontainer: {
    // fjustifyContent: 'space-between',
    width: '90%', // Đặt chiều rộng của phần tử
    height: '88%',
    marginTop: 50,
    marginBottom: 80,

    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16, 
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    
  },
  registerButton: {
    marginTop: 25,
    backgroundColor: '#4F46E5',
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
    borderRadius: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  headerBackIcon: {
    marginLeft: 10,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center',
   
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
    backgroundColor: '#0f0ffa',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    width: '100%',
  },
});

export default RegisterPage;
