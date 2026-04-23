import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../components/validateuser";

const Inbox = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const unread = notifications.filter((n) => !n.is_acknowledged);
  const unreadCount = unread.length;

  useEffect(() => {
    const fetchNotifications = async () => {
      console.log("currentUser:", currentUser);

      if (!currentUser?.feide_id) return;

      try {
        const res = await api.get(
          `/notifications/for_user/${currentUser.feide_id}`
        );

        console.log("API response:", res.data);

        setNotifications(res.data.notifications || res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const handleBellClick = async () => {
    if (unread.length === 0) return;

    try {
      await api.post("/notifications/acknowledge", {
        notification_id_list: unread.map((n) => n.id),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          unread.some((u) => u.id === n.id)
            ? { ...n, is_acknowledged: true }
            : n
        )
      );
    } catch (err) {
      console.error("Failed to acknowledge:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/${id}/delete`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="card shadow-sm" style={{ maxWidth: "400px" }}>
      
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Varsler</h6>

        <button
          className="btn position-relative p-0 border-0 bg-transparent"
          onClick={handleBellClick}
          title="Marker alle som lest"
        >
          <span style={{ fontSize: "1.3rem" }}>🔔</span>

          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Body */}
      <div
        className="card-body p-2"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {notifications.length === 0 ? (
          <p className="text-muted text-center mt-2">
            Ingen varsler
          </p>
        ) : (
          <div className="list-group">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`list-group-item d-flex justify-content-between align-items-start ${
                  !n.is_acknowledged ? "list-group-item-primary" : ""
                }`}
              >
                <div className="me-2">
                  <div className="fw-semibold">{n.message}</div>
                  <small className="text-muted">
                    {new Date(n.created_at).toLocaleString()}
                  </small>
                </div>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(n.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;