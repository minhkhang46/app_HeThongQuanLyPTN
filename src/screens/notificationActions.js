// notificationActions.js
export const setNotifications = (notifications, unreadCount) => ({
    type: 'SET_NOTIFICATIONS',
    payload: { notifications, unreadCount },
  });
  
  export const markNotificationAsRead = notificationId => ({
    type: 'MARK_NOTIFICATION_AS_READ',
    payload: { notificationId },
  });
  
  export const deleteNotification = notificationId => ({
    type: 'DELETE_NOTIFICATION',
    payload: { notificationId },
  });
  