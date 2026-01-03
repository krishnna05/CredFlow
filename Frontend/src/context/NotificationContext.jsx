import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Wrapper for Toast notifications to ensure consistency
  const notify = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    loading: (message) => toast.loading(message),
    dismiss: (toastId) => toast.dismiss(toastId),
    promise: (promise, messages) => toast.promise(promise, messages),
    custom: (component) => toast.custom(component),
  };

  // Fetch persistent notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axiosInstance.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [user]);

  const markAsRead = useCallback(async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      notify.error('Could not update notification');
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await axiosInstance.delete('/notifications');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      notify.error('Could not clear notifications');
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notify,
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;