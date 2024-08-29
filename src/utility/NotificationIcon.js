import React from 'react';
import { Bell } from 'react-feather';

const NotificationIcon = ({ hasNotification }) => {
  return (
    <div style={{ marginRight: '40px', position: 'relative' }}>
      <Bell size={20} color='#555' />
      {hasNotification && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '10px',
            height: '10px',
            background: 'red',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );
};

export default NotificationIcon;
