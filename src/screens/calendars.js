import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';

const EventCalendarScreen = () => {
  const [events, setEvents] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Gửi yêu cầu GET để lấy dữ liệu từ cơ sở dữ liệu
    axios.get('http://192.168.56.1:3000/data_calendar')
      .then(response => {
        const fetchedEvents = formatEvents(response.data);
        const filledEvents = fillMissingDates(fetchedEvents);
        setEvents(filledEvents);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  const formatEvents = (data) => {
    // Chuyển đổi dữ liệu từ cơ sở dữ liệu thành dạng phù hợp cho Agenda
    const formattedEvents = {};
    data.forEach(event => {
      const date = event.date.split('T')[0];
      if (!formattedEvents[date]) {
        formattedEvents[date] = [];
      }
      formattedEvents[date].push({
        id: event.id,
        title: event.ID_User,
        // description: event.description,
        lab_name: event.lab_name,
        time: event.registration_time,
      });
    });
    return formattedEvents;
  };

  const fillMissingDates = (events) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const filledEvents = {};
  
    for (let month = 1; month <= 12; month++) {
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        filledEvents[date] = events[date] || [];
      }
    }
  
    return filledEvents;
  };

  const renderEvent = (event) => {
    // Hiển thị thông tin sự kiện
    return (
      <View key={event.id}>
        <Text style={styles.text}>{event.title}</Text>
        <Text style={styles.text1}>{event.lab_name}</Text>
        <Text style={styles.text1}>{event.time}</Text>
      </View>
    );
  };

  const renderEmptyData = () => {
    // Hiển thị khi không có sự kiện
    return <Text>No events</Text>;
  };

  const customTheme = {
    agendaDayTextColor: 'black', // Màu chữ của ngày trong Agenda
    agendaDayNumColor: 'black', // Màu chữ số của ngày trong Agenda
    agendaTodayColor: 'red', // Màu của ngày hiện tại trong Agenda
    agendaKnobColor: '#2626fc', // Màu của nút cuộn trong Agenda
  };
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <Agenda
        items={events}
        renderItem={(event, firstItemInDay) => (
          <View style={styles.eventContainer}>
            {firstItemInDay && <Text style={styles.date}>{event.date}</Text>}
            {renderEvent(event)}
          </View>
        )}
        renderEmptyData={renderEmptyData}
        theme={customTheme}
      />
      
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 12,
    padding: 5 ,
    fontWeight: 'bold',
    fontSize: 16, 
  },
  text1: {
    marginTop: -2,
    padding: 5,
    fontSize: 15,
  },
  eventContainer: {
    marginBottom: 10, // Điều chỉnh khoảng cách giữa các sự kiện
  },
});

export default EventCalendarScreen;
