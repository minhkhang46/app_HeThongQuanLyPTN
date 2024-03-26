import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
const ListScreen = ({ navigation }) => {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false); 
    useEffect(() => {
        setShowLoginModal(true);    

        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://192.168.56.1:3000/data_calendar')
            .then(response => {
                const sortedRequests = response.data.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });

                const formattedRequests = sortedRequests.map(request => ({
                    ...request,
                    // date: formatDate(request.date)
                }));

                setRequests(formattedRequests);
            })
            .catch(error => {
                console.error('Error fetching requests: ', error);
            });
    };

     const showDatePickerModal = () => {
        setShowDatePicker(true);
      };
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
                <Image source={require('../../assets/left-arrow.png')} style={styles.headerIcon} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 19, textAlign: 'center', marginLeft: 10, fontWeight: 'bold' }}>Danh Sách Đăng Ký</Text>
                </View>
             </View>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Nhập ID_User để tìm kiếm"
                        value={searchTerm}
                        onChangeText={text => setSearchTerm(text)}
                    />
                    <TouchableOpacity >
                    <Image source={require('../../assets/search.png')} style={styles.searchButton} />
                    </TouchableOpacity>
                </View>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.headerText}>Mã Số</Text>
                            {/* <Text style={styles.headerText}>Họ Tên</Text> */}
                            <Text style={styles.headerText}>Phòng Thí Nghiệm</Text>
                            <Text style={styles.headerText}>Tổng số</Text>
                            <Text style={styles.headerText}>Thời gian</Text>
                            <Text style={styles.headerText}>Ngày đăng ký</Text>
                            <Text style={styles.headerText}></Text>
                        </View>
                        {(filteredRequests.length > 0 ? filteredRequests : requests).map(request => (
                            <View style={styles.row} key={request.id}>
                                <Text style={styles.cell1}>{request.ID_User}</Text>
                                {/* <Text style={styles.cell}>{request.full_name}</Text> */}
                                <Text style={styles.cell}>{request.lab_name}</Text>
                                <Text style={styles.cell}>{request.quantity}</Text>
                                <Text style={styles.cell}>{request.registration_time}</Text>
                                <Text style={styles.cell}>{request.date}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Request', { selectedRequest: request })}>
                                    <Image source={require('../../assets/request.png')} style={styles.icon}/>
                                </TouchableOpacity>

                            </View>
                        ))}
                    </View>
              
            </View>
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
 
    container: { 
        padding: 5,
        backgroundColor: '#A1DCFF',
        // flex: 1,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Căn chỉnh các phần tử theo trục dọc để chúng nằm ở chính giữa
    },

    searchInput: {
        height: 40,
        width: '50%',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginLeft: 120,
    },
    searchButton: {
        fontSize: 16,
        color: 'blue',
        marginBottom: 10,
        marginLeft: 10,
        marginTop: 10,
       
        width: 40,
        height: 40,
        resizeMode: 'contain',
        fontWeight: "bold",
    },
    icon:{
      
        marginBottom: 20,
        marginLeft: 10,
        marginTop: 25,
        width: 50,
        height: 50,
        resizeMode: 'contain',
        fontWeight: "bold",
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
        width: '100%', // Đặt chiều rộng của phần tử
        backgroundColor: 'white',
       
        padding: 4, 
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

      
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        
        borderColor: 'black',
    },
    headerText: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
        padding: 5,
        textAlign: 'center',
        paddingRight: 1,
    },
  
    cell: {
        flex: 1,
        padding: 2,
        textAlign: 'center',
        fontSize: 14,
    },
    cell1: {
        flex: -1,
        padding: 3,
        textAlign: 'center',
        fontSize: 14,
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

export default ListScreen;
