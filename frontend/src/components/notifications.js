import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import "../styles/notifications.css";

const Notifications = ({ programId, setNotificationsRef }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadNotifications = notifications.filter((n) => !n.is_acknowledged);
  const unreadCount = unreadNotifications.length;
  const overlayRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!programId) return;
      try {
        const response = await api.get(
          `/notifications/${programId}`,
        );
        setNotifications(response.data);
        if (setNotificationsRef) {
          setNotificationsRef(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [programId, setNotificationsRef]);

  const toggleNotifications = async () => {
    const opening = !isOpen;
    setIsOpen(opening);

    if (opening) {
      const unread = notifications.filter(n => !n.is_acknowledged);

      if (unread.length === 0) return;

      try {
        await api.post('/notifications/acknowledge', {
          notification_id_list: unread.map(n => n.id)
        });

        setNotifications(prev =>
          prev.map(n =>
            unread.some(u => u.id === n.id)
              ? { ...n, is_acknowledged: true }
              : n
          )
        );

      } catch (error) {
        console.error('Failed to acknowledge notifications:', error);
      }
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await api.delete(
        `/notifications/${notificationId}/delete`,
      );
      console.log("Notification deleted:", response.data);

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId,
        ),
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="notification-container">
      {/* Notification Badge/Button */}
      <button
        className="notification-badge"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <span className="badge-icon">🔔</span>
        {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
      </button>

      {/* Notification Overlay */}
      {isOpen && (
        <div className="notification-overlay" ref={overlayRef}>
          <div className="notification-header">
            <h3>Notifikasjoner</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>Ingen notifikasjoner</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className="notification-item"
                >
                  <div className="notification-content">
                    <p>
                      <strong>Melding:</strong> {notification.message}
                    </p>
                    <div className="notification-meta">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    Slett
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
