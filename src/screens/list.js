import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Modal } from 'react-native';
import axios from 'axios';

const ListScreen = ({ navigation }) => {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [currentUserID, setCurrentUserID] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get('http://192.168.56.1:3000/profile')
            .then(response => {
                setCurrentUserID(response.data.macv);
            })
            .catch(error => {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            });

        axios.get('http://192.168.56.1:3000/data_calendar')
            .then(response => {
                const sortedRequests = response.data.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                });

                const formattedRequests = sortedRequests.map(request => ({
                    ...request,
                    date: formatDate(request.date)
                }));


                setRequests(formattedRequests);
            })
            .catch(error => {
                console.error('Error fetching requests: ', error);
            });
    };

    const filterRequestsByID = () => {
        const filtered = requests.filter(request => request.ID_User.toLowerCase().startsWith(searchTerm.toLowerCase()));
        setFilteredRequests(filtered);
    };

    const canEditRequest = (request) => {
        return request.ID_User === currentUserID;
    };

    const handleList = () => {
        navigation.navigate('Main');
    };

    const handlePress = (request) => {
        if (!canEditRequest(request)) {
            setShowAlert(true);
        } else {
            navigation.navigate('Request', { selectedRequest: request });
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    };

    
    // Sau đó, trong mã của bạn, bạn có thể sử dụng hàm formatDate như sau:
  
    
    return (
        <View style={styles.con}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleList}>
                    <Image source={require('../../assets/left-arrow.png')} style={styles.headerIcon} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 19, textAlign: 'center', marginLeft: 10, fontWeight: 'bold',marginTop: 40 }}>Danh Sách Đăng Ký</Text>
                </View>
            </View>
            <View >
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Nhập ID_User để tìm kiếm"
                        value={searchTerm}
                        onChangeText={text => setSearchTerm(text)}
                    />
                    <TouchableOpacity onPress={filterRequestsByID}>
                        <Image source={require('../../assets/search.png')} style={styles.searchButton} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.container}>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.headerText}>Mã Số</Text>
                            <Text style={styles.headerText}>Phòng Thí Nghiệm</Text>
                            <Text style={styles.headerText}>Tổng số</Text>
                            <Text style={styles.headerText}>Thời gian</Text>
                            <Text style={styles.headerText}>Ngày đăng ký</Text>
                            <Text style={styles.headerText}></Text>
                        </View>
                        {(filteredRequests.length > 0 ? filteredRequests : requests).map(request => (
                            <View style={styles.row} key={request.id}>
                                <Text style={styles.cell1}>{request.ID_User}</Text>
                                <Text style={styles.cell}>{request.lab_name}</Text>
                                <Text style={styles.cell}>{request.quantity}</Text>
                                <Text style={styles.cell}>{request.registration_time}</Text>
                                <Text style={styles.cell}>{request.date}</Text>
                                <TouchableOpacity onPress={() => handlePress(request)}>
                                    <Image source={require('../../assets/request.png')} style={styles.icon}/>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <Modal visible={showAlert} transparent={true} animationType="fade">
             
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Bạn không có quyền chỉnh sửa yêu cầu này.</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setShowAlert(false)}>
                        <Text style={{ color: 'white' ,fontSize: 18}}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    con:{
       flex: 1,
        backgroundColor: '#A1DCFF'
    },
    container: { 
        padding: 5,
    },
    // header: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     marginBottom: 10,
        
    // },
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
   
        marginBottom: -2,
        flexDirection: 'row', 
        padding: 5,
        backgroundColor: 'white',
    },
    headerIcon:{
        marginLeft: 10,
        width: 30,
        height: 30,
        resizeMode: 'contain',
        fontWeight: "bold",
        marginTop: 40
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
        backgroundColor: 'rgb(242, 250, 251)',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        top: '40%',
        left: '8%',
        right: '10%',
        width: '100%', // Điều chỉnh kích thước của modal
        maxWidth: 350, // Điều chỉnh kích thước tối đa của modal
    },
    modalText: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
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

export default ListScreen;
