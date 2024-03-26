import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Modal from 'react-native-modal';

const RegisterScreen = ({ navigation }) => {
  // State declarations
  const [ID_User, setID_User] = useState('');
  const [full_name, setFull_name] = useState('');
  const [email, setEmail] = useState('');
  const [lab_name, setLab_name] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [registration_time, setRegistration_time] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [failureModalVisible, setFailureModalVisible] = useState(false); 
  const [QuanlityModalVisible, setQuanlityModalVisible] = useState(false); 
  const [labOptions, setLabOptions] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isRegisterSent, setIsRegisterSent] = useState(false);
  // Fetch lab data function
  const fetchLabData = () => {
    axios.get('http://192.168.56.1:3000/labs')
      .then(response => {
        const labs = response.data;
        const options = labs.map(({ TenPTN, idPTN }) => ({
          label: `${idPTN} - ${TenPTN}`,
          value: `${idPTN} - ${TenPTN}`,
        }));
        setLabOptions(options);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Fetch time data function
  const fetchTimeData = () => {
    axios.get('http://192.168.56.1:3000/times')
      .then(response => {
        const times = response.data;
        const optionstime = times.map(({ ThoiGianBd, ThoiGianKT }) => ({
          label: `${ThoiGianBd.substring(0, 5)} - ${ThoiGianKT.substring(0, 5)}`,
          value: `${ThoiGianBd.substring(0, 5)} - ${ThoiGianKT.substring(0, 5)}`,
        }));
        setTimeOptions(optionstime);
      })
      .catch(error => {
        console.error('Error fetching time data: ', error);
      });
  };

  // Show date picker modal function
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // Date change handler function
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
      
  const handleRegister = () => {
    // Check if quantity exceeds 10
    if (quantity > 10) {
        setQuanlityModalVisible(true);
        return;
    }
    axios.get('http://192.168.56.1:3000/data_labs')
        .then(response => {
            const data = response.data;
            const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Chuyển đổi định dạng của biến date

            const foundRegister = data.some(item => {
                const itemDate = new Date(item.date);
                return (
                    item.lab_name === lab_name &&
                    item.registration_time === registration_time &&
                    itemDate.getTime() === formattedDate.getTime() // So sánh giá trị số của các ngày
                );
            });
            
            if (foundRegister) {
                setIsRegisterSent(true);
            } else {
                // Gửi yêu cầu lên máy chủ
                dinhnghiaPost();
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu từ bảng data_labs:', error);
        });
};




  // Post registration data function
  const dinhnghiaPost = () => {
    const url = "http://192.168.56.1:3000/data";
    const formattedDate = new Date(date); // Chuyển đổi ngày thành đối tượng Date
  
    // Lấy thông tin về năm, tháng và ngày
    const year = formattedDate.getFullYear();
    const month = formattedDate.getMonth() + 1;
    const day = formattedDate.getDate();
  
    axios.post(url, {
      ID_User: userInfo.macv,
      full_name: userInfo.name,
      email: userInfo.email,
      lab_name,
      quantity,
      registration_time,
      // Sử dụng thông tin về năm, tháng và ngày để gửi lên cơ sở dữ liệu
      date: `${year}-${month}-${day}` // Định dạng thành 'yyyy-mm-dd'
    })
    .then((res) => {
      // console.log(res);
      setID_User('');
      setFull_name('');
      setEmail('');
      setLab_name(null);
      setQuantity('');
      setRegistration_time('');
      setDate(new Date());
      setSuccessModalVisible(true);
      setTimeout(() => {
        navigation.navigate('QRcode', {
          ID_User: userInfo.macv,
          lab_name,
          quantity,
          registration_time,
          date: `${year}-${month}-${day}` // Cũng sử dụng định dạng này ở đây
        });
        setSuccessModalVisible(false);
      }, 2000);
    })
    .catch((err) => {
      console.log(err);
      Alert.alert("Đăng ký không thành công", "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
    });
  };

  // Format date function
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };
  


  useEffect(() => {
    axios.get('http://192.168.56.1:3000/profile')
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      });
    fetchLabData();
    fetchTimeData();
  }, []);

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
              value={userInfo ? userInfo.macv : ID_User}
              editable={false} 
            />
            <Text style={styles.label}>Họ và Tên:</Text>
            <TextInput
              style={[styles.input, styles.disabledTextInput]}
              placeholder="Nhập tên"
              onChangeText={setFull_name}
              value={userInfo ? userInfo.name :  full_name}
              editable={false} 
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={[styles.input, styles.disabledTextInput]}
              placeholder="Nhập email"
              onChangeText={setEmail}
              value={userInfo ? userInfo.email: email}
              keyboardType="email-address"
              editable={false}
            />
            <Text style={styles.label}>Chọn phòng thí nghiệm</Text>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                onValueChange={setLab_name}
                items={labOptions}
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
                display="spinner" // Đặt display thành 'spinner' để chỉ hiển thị ngày tháng năm
                onChange={onChangeDate}
              />
            )}

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
      <Modal isVisible={isSuccessModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Đăng ký thành công</Text>
        </View>
      </Modal>
      <Modal isVisible={failureModalVisible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Mã xác thực không đúng!</Text>
          <TouchableOpacity style={styles.okButton} onPress={() => setFailureModalVisible(false)}>
            <Text style={styles.buttonText1}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={QuanlityModalVisible}>
        <View style={styles.modal1}>
          <Text style={styles.modalText1}>Tổng số người không được vượt quá 10</Text>
          <TouchableOpacity style={styles.okButton} onPress={() => setQuanlityModalVisible(false)}>
            <Text style={styles.buttonText1}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={isRegisterSent}>
        <View style={styles.modal2}>
          <Text style={styles.modalText2}>Đăng ký không thành công </Text>
          <Text style={styles.modalText3}>Phòng thí nghiệm, thời gian hoặc ngày đã tồn tại </Text>
          <TouchableOpacity style={styles.okButton} onPress={() => setIsRegisterSent(false)}>
            <Text style={styles.buttonText1}>Đóng</Text>
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
    color: 'black',
    pointerEvents: 'none'
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
    backgroundColor: '#A1DCFF',
  },
  pagecontainer: {
    width: '90%',
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
    marginTop: 20,
    marginBottom: 8,
    backgroundColor: '#0f0ffa',
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
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight:'bold',
  },
  modalText1: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight:'bold',
  },
  buttonText1: {
    color: 'white',
    fontSize: 16,
  },
  modal: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    marginRight: 20,
    marginLeft: 20,
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  modal1: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '98%',
    marginRight: 10,
    marginLeft: 3,
  },
  modal2: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginRight: 10,
    marginLeft: 3,
  },
  modalText2: {
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 20,
    fontWeight:'bold',
  },
  modalText3: {
    marginTop: 2,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 17.6,
    fontWeight:'bold',
  },
  okButton: {
    backgroundColor: '#0f0ffa',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
});

export default RegisterScreen;
