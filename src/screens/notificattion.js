import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Notification = () => {
  const [requests, setRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // Biến state để lưu số tin nhắn chưa đọc
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get('http://192.168.56.1:3000/profile');
        setCurrentUser(userResponse.data);

        // Fetch notification data
        const notificationResponse = await axios.get('http://192.168.56.1:3000/notifications');
        const allRequests = notificationResponse.data;

        // Filter and sort requests
        const filteredRequests = allRequests.filter(item => (
          (item.idUser === userResponse.data.macv && item.yesno === 0 && item.status === 1) ||
          (item.idUser === userResponse.data.macv && item.yesno === 1 && item.status === 1)
        ));
        filteredRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredRequests.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // Count unread notifications
        const unreadNotifications = filteredRequests.filter(item => !item.read && !item.deleted).length;
        setUnreadCount(unreadNotifications);

        setRequests(filteredRequests);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, []);

  const updateRequest = (notificationId) => {
    const updatedRequests = requests.map(item => {
      if (item.id === notificationId) {
        return { ...item, read: true };
      }
      return item;
    });
    setRequests(updatedRequests);

    // Cập nhật số tin nhắn chưa đọc
    const unreadNotifications = updatedRequests.filter(item => !item.read && !item.deleted).length;
    setUnreadCount(unreadNotifications);
  };

  const handleNotificationPress = async (notificationId) => {
    try {
      // Call your API to mark notification as read
      // Then call updateRequest
      updateRequest(notificationId);
    } catch (error) {
      console.error('Lỗi khi xử lý thông báo:', error);
    }
  };

  const handleDeleteNotification = (notificationId) => {
    const updatedRequests = requests.map(item => {
      if (item.id === notificationId) {
        return { ...item, deleted: true }; // Đánh dấu tin nhắn đã bị xóa
      }
      return item;
    });
    setRequests(updatedRequests);

    // Cập nhật số tin nhắn chưa đọc
    const unreadNotifications = updatedRequests.filter(item => !item.read && !item.deleted).length;
    setUnreadCount(unreadNotifications);
  };

  // Render item
  const renderItem = ({ item }) => {
    if (item.deleted) {
      return null; // Không render tin nhắn đã bị xóa
    }

    let statusText = '';
    if (item.yesno === 1 && item.status === 1) {
      statusText = 'Yêu cầu được cập nhật';
    } else if (item.yesno === 0 && item.status === 1) {
      statusText = 'Yêu cầu không được cập nhật';
    } else {
      statusText = 'Trạng thái không xác định';
    }
    let statusquan = '';
    if (item.yesno === 1 && item.status === 1) {
      statusquan = 'Số lượng được cập nhật: ';
    } else if (item.yesno === 0 && item.status === 1) {
      statusquan = 'Số lượng không được cập nhật: ';
    } else {
      statusquan = 'Trạng thái không xác định';
    }

    const statusStyle = item.read ? styles.label1 : [styles.label1, { color: '#0f0ffa' }];

    return (
      <TouchableOpacity onPress={() => handleNotificationPress(item.id)}>
        <View style={styles.itemContainer}>
          <View key={item.id}>
            <Text style={statusStyle}>{statusText}</Text>
            <View style={styles.separator}></View>
            <Text style={styles.label}>{item.idPTN}</Text>
            <Text style={styles.label}>{statusquan}{item.quantity}</Text>
            <Text style={styles.label}>Ngày đăng ký: {item.date}</Text>
            <TouchableOpacity onPress={() => handleDeleteNotification(item.id)}>
               <Image source={require('../../assets/delete.png')} style={{ width: 30, height: 30, marginTop: 10,}} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.unreadText}>Số thông báo chưa đọc: {unreadCount}</Text>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A1DCFF',
    padding: 20,
  },
  unreadText:{
    fontSize: 18,
    fontWeight:'bold',
    marginTop: -2,
    marginBottom: 10,
  },
  itemContainer: {
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  separator: {
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
  },
  label1: {
    flex: 1,
    fontSize: 18,
    marginBottom: 2,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  deleteButton: {
    color: 'red',
    textAlign: 'left',
    fontSize: 16,
    marginTop: 5,
  },
});

export default Notification;
