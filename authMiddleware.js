import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu từ máy chủ Node.js
    axios.get('http://192.168.56.1:3000/data') // Thay đổi địa chỉ IP thành địa chỉ IP của máy chủ Node.js
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dữ liệu từ máy chủ:</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View>
            <Text>Mã số: {item.ID_User}</Text>
            <Text>Họ và tên: {item.full_name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Ngày đăng ký: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default App;
