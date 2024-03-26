// notificationReducer.js
const initialState = {
    notifications: [],
    unreadCount: 0,
  };
  
  const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_NOTIFICATIONS':
        return {
          ...state,
          notifications: action.payload.notifications,
          unreadCount: action.payload.unreadCount,
        };
      case 'MARK_NOTIFICATION_AS_READ':
        return {
          ...state,
          notifications: state.notifications.map(notification =>
            notification.id === action.payload.notificationId
              ? { ...notification, read: true }
              : notification
          ),
          unreadCount: state.unreadCount - 1,
        };
      case 'DELETE_NOTIFICATION':
        return {
          ...state,
          notifications: state.notifications.map(notification =>
            notification.id === action.payload.notificationId
              ? { ...notification, deleted: true }
              : notification
          ),
          unreadCount: state.unreadCount - 1,
        };
      default:
        return state;
    }
  };
  
  export default notificationReducer;
  