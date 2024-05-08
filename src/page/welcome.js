import React, { useState, useEffect, useRef} from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Policy from '../screens/policy';
import Calendar from '../page/calendarspage'
import Profiles from '../page/profilepage'
import Notification from '../page/notidicationpage'
import { NavigationContext } from '@react-navigation/native';
import axios from 'axios';
// Màn hình Home
function WelcomePage() {
  // Thiết lập tiêu đề cho màn hình Home
  const navigation = React.useContext(NavigationContext);
 
  const handleloginPress = () => {
    navigation.navigate('Login');
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/1.png')}
            style={styles.logo}
          />
              <TouchableOpacity style={styles.loginButton} onPress={handleloginPress}>
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        height: 117,
      },
    });
  }, []);

  const handleIconPress = () => {
    navigation.navigate('QRpage');
  };
  const handleIconPressregister = () => {
    navigation.navigate('RegisterPage');
  };

  const handleIconPresspolicy = () => {
    // Chuyển hướng đến màn hình 'TenTrangKhac'
    navigation.navigate('Policypage');
  };

  const handleIconPressrequest = () => {
    // Chuyển hướng đến màn hình 'TenTrangKhac'
    navigation.navigate('ListPage');
  };
  const imageData = [
    { image: require('../../assets/1698380522.png'), name: 'PTN01 - Phòng Thí Nghiệm Công Nghệ Vật Liệu' },
    { image: require('../../assets/1698340267.jpg'), name: 'PTN02 - Phòng Thí Nghiệm Kỹ Thuật Vật Liệu' },
    { image: require('../../assets/1699199859.png'), name: 'PTN03 - Phòng Thí Nghiệm Vật Liệu Y Sinh ' },
    { image: require('../../assets/1698340499.jpg'), name: 'PTN04 - Phòng Thí Nghiệm Vật Liệu Polymer' },
    { image: require('../../assets/1698340267.jpg'), name: 'PTN05 - Phòng Thí Nghiệm Nano - Điện' },
    // { image: require('../../assets/1698340267.jpg'), name: 'Image 2' },
    // Thêm các đối tượng hình ảnh và tên tương ứng khác nếu cần
  ];
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const scroll = setInterval(() => {
      if (flatListRef.current) {
        if (currentIndex < imageData.length - 1) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        } else {
          setCurrentIndex(0);
        }
        flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
      }
    }, 3000);

    return () => clearInterval(scroll);
  }, [currentIndex]);
  return (
    <View style={styles.contentContainer}>
        <View style={styles.triangleContainer1}>
            <Image source={require('../../assets/down.png')} style = {{height: 30, width: 30, right: 16,}}/>
            <Text style={styles.triangleText}>Phòng Thí Nghiệm</Text>
        </View>
        
        <FlatList
          ref={flatListRef}
          horizontal
          data={imageData}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
              <Text style={styles.name}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
          <View style={styles.triangleContainer}>
            <Image source={require('../../assets/down.png')} style = {{height: 30, width: 30, right: 16,}}/>
            <Text style={styles.triangleText}>Đăng ký phòng thí nghiệm</Text>
          </View>
          <View style={styles.borcontainer}>
            {/* <View>
              <View style={styles.boxcontainer}>
                <TouchableOpacity onPress={handleIconPress}>
                  <Image source={require('../../assets/chemistry.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.text}>Danh mục</Text>
              <Text style={styles.text1}>phòng thí nghiệm</Text>
            </View> */}
            <View>
              <View style={styles.boxcontainer}>
                <TouchableOpacity onPress={handleIconPresspolicy}>
                  <Image source={require('../../assets/auction.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.text2}>Quy định đăng ký</Text>
             
            </View>
            <View>
              <View style={styles.boxcontainer}>
                <TouchableOpacity onPress={handleIconPressregister}>
                  <Image source={require('../../assets/edit.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.text3}>Đăng ký phòng</Text>
             
            </View>
            <View>
              <View style={styles.boxcontainer}>
                <TouchableOpacity onPress={handleIconPressrequest}>
                  <Image source={require('../../assets/to-do-list.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.text4}>Danh sách đăng ký</Text>
             
            </View>
            <View>
              <View style={styles.boxcontainer}>
                <TouchableOpacity onPress={handleIconPress}>
                  <Image source={require('../../assets/qr-code.png')} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <Text style={styles.text5}>Mã QR đăng ký</Text>
             
            </View>
          </View>
    </View>
  );
}

// Màn hình Settings
function CalendarScreen() {
  return (
    <View style={styles.contentContainer}>

      <Calendar />
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={styles.contentContainer}>
     <Notification />
    </View>
  );
}
function ProfilePage() {
  return (
    <View style={styles.contentContainer}>
      <Profiles />
     
    </View>
  );
}
// Tạo Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabel: false,
        headerShown: true, // Ẩn header mặc định
        tabBarStyle: {
          height: 68, // Điều chỉnh chiều cao của thanh bottom tab theo mong muốn của bạn
        },
        tabBarLabelStyle: {
          fontSize: 18,// Điều chỉnh kích thước chữ cho nhãn trong thanh bottom tab
        },
        tabBarInactiveTintColor: 'black', // Màu chữ khi không được chọn
        tabBarActiveTintColor: '#2626fc', // Màu chữ khi được chọn
      }}
    >
       <Tab.Screen
          name="Home"
          component={WelcomePage}
          options={{
            tabBarLabel: 'Trang chủ',
            tabBarIcon: ({ color, size }) => (
              <Image source={require('../../assets/home.png')} style={{ width: 35, height: 35, tintColor: color }} />
            ),
          }}
        />
        <Tab.Screen
          name="Lịch đăng ký phòng thí nghiệm"
          component={CalendarScreen}
          options={{
            tabBarLabel: 'Lịch',
            tabBarIcon: ({ color, size }) => (
              <Image source={require('../../assets/calendar.png')} style={{width: 35, height: 35, tintColor: color }} />
            ),
          }}
        />
        <Tab.Screen
          name="Thông báo"
          component={NotificationsScreen}
          options={{
            tabBarLabel: 'Thông báo',
            tabBarIcon: ({ color, size }) => (
              <Image source={require('../../assets/notification.png')} style={{ width: 35, height: 35, tintColor: color }} />
            ),
          }}
        />
        <Tab.Screen
          name="Thông tin sinh viên"
          component={ProfilePage}
          options={{
            tabBarLabel: 'Cá nhân',
            tabBarIcon: ({ color, size }) => (
              <Image source={require('../../assets/profile.png')} style={{ width: 35, height: 35, tintColor: color }} />
            ),
          }}
        />
        
    </Tab.Navigator>
  );
}

// App chính


// Styles
// Styles

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    width: 200, 
    height: 500,
    alignItems: 'center',
    
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 16,
    backgroundColor: '#A1DCFF',
  },

  text:{
    fontSize: 15,
    marginLeft: 27,
    fontWeight: 'bold',
  },
  text1:{
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text2 :{
    fontSize: 15,
    marginLeft: 1,
    fontWeight: 'bold',

  },

  text3:{
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: 'bold',
  },

  text4:{
    fontSize: 15,
    marginLeft: 2, 
    fontWeight: 'bold',
  }, 

  text5: {
    fontSize: 15,
    marginLeft: 15, // Điều chỉnh khoảng cách từ bên trái
    marginRight: 135, // Điều chỉnh khoảng cách từ bên phải
    marginBottom: 10,
    fontWeight: 'bold',
  },


  itemContainer: {
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: -200,
    backgroundColor: 'white',
    width: 390,
    height: 250,
  },
  image: {
    width: 340,
    height: 200,
    marginTop: 9,
  },
 
  name: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: 'bold',
  },

  borcontainer:{
    width: '95%', // Đặt chiều rộng của phần tử
    height: '95%',
    marginTop: 20,
    marginBottom: 35,
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },

  triangleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0ffa', // Màu nền của hình tam giác
    paddingHorizontal: 20, // Khoảng cách giữa văn bản và tam giác
    paddingVertical: 7, // Khoảng cách dọc của hình tam giác
    borderTopRightRadius: 50, // Để bo tròn góc trên bên phải
    borderBottomRightRadius: 50,
    width: '80%',
  },
  triangleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // Màu của văn bản
    marginLeft: -5,
  },

  triangleContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0ffa', // Màu nền của hình tam giác
    paddingHorizontal: 20, // Khoảng cách giữa văn bản và tam giác
    paddingVertical: 7, // Khoảng cách dọc của hình tam giác
    borderTopRightRadius: 50, // Để bo tròn góc trên bên phải
    borderBottomRightRadius: 50,
    width: '80%',
    marginTop: 25
  },
  

  icon:{
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',

  },

  logo: {
    width: 170, // Đặt kích thước cố định hoặc sử dụng tỷ lệ phần trăm phù hợp
    height: 200, // Đặt kích thước cố định hoặc sử dụng tỷ lệ phần trăm phù hợp
    resizeMode: 'contain', // Đảm bảo logo được hiển thị đầy đủ mà không bị cắt xén
    // magrinRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
   
  },

  user:{
    width: 45,
    height: 45,
    marginLeft: 10,
  },
 
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#A1DCFF',
  },

  boxcontainer:{
    width: 60, // Điều chỉnh kích thước ô vuông theo mong muốn của bạn
    height: 60, // Điều chỉnh kích thước ô vuông theo mong muốn của bạn
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 5,
    marginTop: 9,
    marginLeft: 34,
    backgroundColor: '#A1DCFF',
    marginBottom: 10,
    borderRadius: 5,
  },
  loginButton: {
    marginTop: 2,
    marginLeft: 70,
    backgroundColor: '#0f0ffa',
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    width: '70%',
    borderRadius: 10,
    height: 40,
  },

  buttonText: {
    color: 'white',
    fontSize: 20,
    paddingTop: 5,
    textAlign: 'center',
  },
});


