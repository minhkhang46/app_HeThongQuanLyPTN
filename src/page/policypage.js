import React, {  useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform ,ScrollView, FlatList} from 'react-native';

const PolicyScreen = ({ navigation }) => {
  const handlePolicy = () => {
    // Thực hiện xử lý đăng ký tại đây (ví dụ: gửi dữ liệu đăng ký đến server)

    // Sau khi đăng ký thành công, bạn có thể điều hướng tới trang khác
    navigation.navigate('Welcome');
  };
  // const [userData, setUserData] = useState([]);

  // useEffect(() => {
  //   // Gửi yêu cầu đến API để lấy dữ liệu
  //   fetch('http://127.0.0.1:3000/api/data')
  //     .then(response => response.json())
  //     .then(data => {
  //       setUserData(data); // Cập nhật state với dữ liệu từ API
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  return (
    <View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePolicy}>
            {/* Icon menu của bạn */}
          <Image source={require('../../assets/left-arrow.png')} style={styles.headerIcon} />
        </TouchableOpacity> 
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 19, textAlign: 'center', marginLeft: 10, fontWeight: 'bold'}}>Quy định đăng ký</Text>
            {/* Nếu bạn muốn thêm nút hoặc thông báo khác, bạn có thể thêm vào đây */}
        </View>
      </View>
     
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.text}>Các quy định đăng ký {'\n'} phòng thí nghiệm</Text>
            <View style={styles.pagecontainer}>
              <Text style={styles.label}>Số lượng đăng ký tối đa không được vượt quá 10 người. </Text>
              
          </View>
       

            <View style={styles.pagecontainer}>
              <Text style={styles.label}>Thời gian đăng ký không được trùng với thời gian trước đó.</Text>
            </View>
        </View>
        
   
      </ScrollView>
    </View>        
  );
};


const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A1DCFF',
    paddingTop: 260,
    paddingBottom: 500,
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
   
  },

  pagecontainer: {
    // fjustifyContent: 'space-between',
    width: '87%', // Đặt chiều rộng của phần tử
    height: '150%',
    marginTop: 10,
    marginBottom: 10,

    backgroundColor: 'white',
    borderRadius: 20,
   
  },
  text: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 20,
    marginTop: -200,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 19,
    // fontWeight: 'bold',
    textAlign: 'justify',
    alignItems: 'center',
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 20,
  },
  
  headerBackIcon: {
    marginLeft: 10,
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  

});

export default PolicyScreen;
