import React from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = React.useState([]);

  return (
    <div className="notifications">
      <h3>Notifications</h3>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((notif, index) => (
            <div key={index} className="notification-item">
              <p>{notif.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
