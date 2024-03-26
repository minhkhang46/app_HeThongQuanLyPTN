import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform ,ScrollView, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import axios from 'axios';

const RequestScreen = ({ route, navigation }) => {
  const [idUser, setid_User] = useState('');
  const [idPTN, setidPTN] = useState('');
  const [quantity, setQuantity] = useState('');
  const [update_time, setupdate_time] = useState(null);

  const [date, setDate] = useState(new Date());
  const [QuanlityModalVisible, setQuanlityModalVisible] = useState(false); 
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);


  //ham gui dang ky
  const dinhnghiaPost = () => {
    if (quantity > 10) {
      setQuanlityModalVisible(true);
      return;
    }
    
    axios.get('http://192.168.56.1:3000/requeststatus')
      .then(response => {
        const data = response.data;
        // Kiểm tra xem dữ liệu idUser, idPTN, update_time và date tồn tại và có status == 0 không
        const foundRequest = data.find(item => 
          item.idUser === idUser && 
          item.idPTN === idPTN && 
          item.update_time === update_time && 
          item.date === date && 
          item.status === 0
        );
        console.log(foundRequest)
        if (foundRequest) {
          // Hiện thông báo yêu cầu đã tồn tại
          setIsRequestSent(true)
        } else {
          // Gửi yêu cầu lên máy chủ
          sendRequest();
        }
      })
      .catch(error => {
        console.error('Lỗi khi lấy dữ liệu từ bảng requeststatus:', error);
      });
  };
  
  const sendRequest = () => {
    const url = "http://192.168.56.1:3000/request";
    axios.post(url, {
      idUser,
      idPTN,
      quantity,
      update_time,
      date,
      status: 0 //Thêm trường status vào yêu cầu đăng ký và gán giá trị là 0
    })
      .then((res) => {
        // Reset dữ liệu
        setid_User('');
        setidPTN('');
        setquantity('');
        setupdate_time(null);
        setDate(new Date());
        // Kiểm tra status trả về từ máy chủ
        if (res.data.idUser && res.data.status === 0) {
          // Hiện thông báo yêu cầu admin xử lý
          Alert.alert("Yêu cầu đã được gửi", "Vui lòng đợi quản trị viên xử lý.");
        } else {
          // Hiện modal thông báo thành công
          setSuccessModalVisible(true);
        }
      })
      .catch((err) => {
        console.log(err);
        // Hiển thị thông báo lỗi nếu có
        Alert.alert("Đăng ký không thành công", "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
      });
  };
  



  useEffect(() => {
    // Gọi hàm fetchLabData khi màn hình được tải hoặc khi người dùng quay lại màn hình này
  
    // Lấy dữ liệu từ route.params và điền vào các TextInput tương ứng
    if (route.params && route.params.selectedRequest) {
        const { selectedRequest } = route.params;
         
        if (selectedRequest.ID_User) setid_User(selectedRequest.ID_User);
        if (selectedRequest.lab_name) setidPTN(selectedRequest.lab_name);
        if (selectedRequest.quantity) setQuantity(selectedRequest.quantity);
        if (selectedRequest.registration_time) setupdate_time(selectedRequest.registration_time);
        if (selectedRequest.date) setDate((selectedRequest.date));
     
      
       
    } else {
        console.log("Không có dữ liệu selectedRequest");
    } 
}, []);


  return (
    <View>
       <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {/* Icon menu của bạn */}
            <Image source={require('../../assets/left-arrow.png')} style={styles.headerIcon} />
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 19, textAlign: 'center', marginLeft: 10, fontWeight: 'bold'}}>Yêu cầu chỉnh sửa phòng thí nghiệm</Text>
            {/* Nếu bạn muốn thêm nút hoặc thông báo khác, bạn có thể thêm vào đây */}
          </View>
        </View>
        <ScrollView>
        <View style={styles.container}>
            <View style={styles.pagecontainer}>
        
                <Text style={styles.text}>Thông Tin Yêu Cầu</Text>
                <Text style={styles.text}>(Vui Lòng Điền Tất Cả)</Text>

                <Text style={styles.label}>Mã Số:</Text>
                <TextInput
                  style={[styles.input, styles.disabledTextInput]} // Sử dụng kiểu disabledTextInput
                  placeholder="Nhập Mã số"
                  onChangeText={setid_User}
                  value={idUser}
                  editable={false} // Ngăn người dùng chỉnh sửa
              />
                <Text style={styles.label}>Chọn Phòng Thí Nghiệm</Text>
                <TextInput
                      style={[styles.input, styles.disabledTextInput]}
                      placeholder='Chọn phòng thí nghiệm...'
                      onChangeText={setidPTN}
                      value={idPTN}
                      editable={false} // thành false để ngăn người dùng chỉnh sửa
                      />
  
                <Text style={styles.label}>Tổng Số Người Chỉnh Sửa (Tối Đa 10 Người)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tổng số từ 1 đến 10"
                    onChangeText={setQuantity}
                    value={quantity} // Chuyển đổi giá trị quantity sang chuỗi để hiển thị
                    keyboardType="numeric"
                    />
                
                <Text style={styles.label}>Thời Gian Đăng Ký (Không Thể Chỉnh Sửa)</Text>
                  <TextInput
                      style={[styles.input, styles.disabledTextInput]}
                      placeholder="ngày đăng ký"
                      onChangeText={setupdate_time}
                      value={update_time}
                      editable={false} // thành false để ngăn người dùng chỉnh sửa
                      />

                <Text style={styles.label}>Ngày Đăng Ký (Không Thể Chỉnh Sửa)</Text>
                    <TextInput
                    style={[styles.input1, styles.disabledTextInput]}
                    placeholder="ngày đăng ký"
                    onChangeText={setDate}
                    value={date}
                    editable={false} // thành false để ngăn người dùng chỉnh sửa
                    />
                <TouchableOpacity style={styles.registerButton} onPress={dinhnghiaPost}>
                    <Text style={styles.buttonText}>Gửi Yêu Cầu</Text>
                </TouchableOpacity>
            </View>
    
        </View>
        </ScrollView>
        <Modal isVisible={successModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Yêu cầu đã được gửi thành công</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => {
                setSuccessModalVisible(false); // Ẩn modal
                navigation.navigate('List'); // Điều hướng đến trang danh sách
            }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Đóng</Text>
            </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={QuanlityModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText1}>Tổng số người không được vượt quá 10</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setQuanlityModalVisible(false)}>
            <Text style={{ color: 'white', fontSize: 18 }}>Đóng</Text>
          </TouchableOpacity>
          
        </View>
      </Modal>
      <Modal isVisible={isRequestSent}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText1}>Đợi admin xử lý yêu cầu trước đó</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => {
                setIsRequestSent(false); // Ẩn modal
                navigation.navigate('List'); // Điều hướng đến trang danh sách
            }}>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  
    backgroundColor: '#A1DCFF',
  },
  pagecontainer: {
    // fjustifyContent: 'space-between',
    width: '90%', // Đặt chiều rộng của phần tử
    height: '80%',
    marginTop: 90,
    marginBottom: 100,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16, 
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 2,
  },

  disabledTextInput: {
    color: 'black', // Đảm bảo màu chữ là đen
    pointerEvents: 'none' // Ngăn người dùng tương tác với TextInput
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '90%',
    marginTop: 6,
    marginBottom: 6,
  },
  input: {
    marginBottom: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 14,
    paddingRight: 8,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
   
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
    modalText1: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight:'bold',
  },
  modalButton: {
    backgroundColor: '#0f0ffa',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    width: '100%',
  },
  input1: {
    marginBottom: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    textAlign:'center',
  
  },

  registerButton: {
    marginTop: 13,
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
  headerBackIcon: {
    marginLeft: 10,
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginBottom: 10,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
   
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center',
   
  },
  header: {
    marginTop: 40,
    marginBottom: -2,
    flexDirection: 'row', 
    padding: 5
  },

  headerIcon:{
    marginLeft: 10,
    width: 30,
    height: 30,
    resizeMode: 'contain',
    fontWeight: "bold",
  },
});

export default RequestScreen;
