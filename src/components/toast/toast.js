import React, { useState } from "react";
import "./toast.css";
import { useSelector } from "react-redux";

// animates from the top

const PrimaryNotification = ({
  notifType,
  notifState,
  notifMessage,
}) => {
  return (
    <div
      className={`notif-primary-${notifState} notif-${notifType}`}
      id="notification-container"
    >
      <div className="notif-section message-section">
        <h4>{notifMessage}</h4>
      </div>
    </div>
  );
};

// animates from the bottom left corner;

const SecondaryNotification = ({
  notifType,
  notifState,
  notifMessage,
}) => {
  return (
    <div
      className={`notif-secondary-${notifState} notif-${notifType}`}
      id="notification-container"
    >
      <div className="notif-section message-section">
        <h4>{notifMessage}</h4>
      </div>
    </div>
  );
};

// animates from the top left corner;

const TertiaryNotification = ({
  notifType,
  notifState,
  notifMessage,
}) => {
  return (
    <div
      className={`notif-tertiary-${notifState} notif-${notifType}`}
      id="notification-container"
    >
      <div className="notif-section message-section">
        <h4>{notifMessage}</h4>
      </div>
    </div>
  );
};

function Toast() {
  const notificationState = useSelector((state) => state.notifications);
  const notifMessage = notificationState.message
  const notifType = notificationState.type
  const notifState = notificationState.toast_state
  const notifLevel = notificationState.level

  if (notifLevel === "primary") {
    return (
      <PrimaryNotification
        notifType={notifType}
        notifState={notifState}
        notifMessage={notifMessage}
      />
    );
  } else if (notifLevel === "secondary") {
    return (
      <SecondaryNotification
        notifType={notifType}
        notifState={notifState}
        notifMessage={notifMessage}
      />
    );
  } else if (notifLevel === "tertiary") {
    return (
      <TertiaryNotification
        notifType={notifType}
        notifState={notifState}
        notifMessage={notifMessage}
      />
    );
  }
}
export default Toast;
