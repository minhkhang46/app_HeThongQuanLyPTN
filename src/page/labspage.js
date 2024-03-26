import React from 'react';
import { View, Image, StyleSheet, Text, ScrollView, TouchableOpacity} from 'react-native';


const LabPage = ({ navigation }) => {
  const List = () => {
    // Thực hiện xử lý đăng ký tại đây (ví dụ: gửi dữ liệu đăng ký đến server)

    // Sau khi đăng ký thành công, bạn có thể điều hướng tới trang khác
    navigation.navigate('Welcome');
  };
  // Mảng chứa đối tượng hình ảnh và tên tương ứng
  const imageData = [
    { image: require('../../assets/1698380522.png'), name: 'PTN01 - Phòng Thí Nghiệm Công Nghệ Vật Liệu' },
    { image: require('../../assets/1698340267.jpg'), name: 'PTN02 - Phòng Thí Nghiệm Kỹ Thuật Vật Liệu' },
    { image: require('../../assets/1699199859.png'), name: 'PTN03 - Phòng Thí Nghiệm Vật Liệu Y Sinh ' },
    { image: require('../../assets/1698340499.jpg'), name: 'PTN04 - Phòng Thí Nghiệm Vật Liệu Polymer' },
    { image: require('../../assets/1698340267.jpg'), name: 'PTN05 - Phòng Thí Nghiệm Nano - Điện' },
    // { image: require('../../assets/1698340267.jpg'), name: 'Image 2' },
    // Thêm các đối tượng hình ảnh và tên tương ứng khác nếu cần
  ];

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={List}>
          <Image source={require('../../assets/left-arrow.png')} style={styles.headerIcon} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 19, textAlign: 'center', marginLeft: 10, fontWeight: 'bold' ,marginTop: 40 }}>Danh mục phòng thí nghiệm</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      {imageData.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Image
            source={item.image}
            style={styles.image}
          />
          <Text style={styles.name}>{item.name}</Text>
        </View>
      ))}
    </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A1DCFF',
  },
  scrollView: {
    height: '100%', // Chiều cao cố định cho ScrollView
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Thêm một lề dưới để đảm bảo nội dung cuộn hết
  },
  itemContainer: {
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    marginTop: 25,
    marginBottom: 10,
    padding: 20,
    backgroundColor: 'white', // Màu nền cho mỗi hình ảnh
    width: '90%', // Độ rộng của mỗi item
  },
  image: {
    width: '100%', // Kích thước hình ảnh sẽ lấp đầy phần nền
    height: 160,
    resizeMode: 'cover',
  },
  name: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: -2,
    flexDirection: 'row', 
    padding: 5,
    backgroundColor: 'white',
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
    marginTop: 40
  },
});

export default LabPage;
