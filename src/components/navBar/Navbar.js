import React, { useEffect, useState } from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import { showNotification, hideNotification } from "../toast/toastActions";
import logo from "./assets/protracker-final-logo.png";

function Navbar() {
  let [notifications, setNotifications] = useState([]);
  let [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    fetch("https://protracker-5hxf.onrender.com/notifications", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotifications(data);
      });
  }, []);


  useEffect(() => {
    fetch("https://protracker-5hxf.onrender.com/user_profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserAvatar(data.avatar_url);
      });
  }, []);

  // redux stuff;
  const dispatch = useDispatch();
  const handleToast = (message, type, level) => {
    dispatch(
      showNotification({
        message: message,
        type: type,
        level: level,
        toast_state: "active",
      })
    );
    setTimeout(() => {
      dispatch(hideNotification());
    }, 3000);
  };

  let userAvatarUrl =
    userAvatar ||
    "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg";

  let formatTimestamp = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " yrs ago";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hrs ago";
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 60) {
      return "1 hour ago";
    } else if (interval === 0) {
      return "just now";
    } else {
      return interval + " mins ago";
    }

    return Math.floor(seconds) + " s ago";
  };

  const markAsRead = () => {
    fetch("https://protracker-5hxf.onrender.com/mark_as_read", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((response) => {
      if (response.ok) {
        handleToast("Marked as read", "new", "tertiary");
      } else {
        handleToast("Failed", "error", "tertiary");
      }
    });
  };

  let unreadMessages = notifications
    ? notifications.filter((notif) => {
        return notif.read === false;
      })
    : [];
  let groupMessages = notifications
    ? notifications.filter((notif) => {
        return (
          notif.notification_type === "Added to cohort" ||
          notif.notification_type === "Added to project"
        );
      })
    : [];
  let interactionMessages = notifications
    ? notifications.filter((notif) => {
        return (
          notif.notification_type === "Achievements unlocked" ||
          notif.notification_type === "Project comment" ||
          notif.notification_type === "Comment reply"  ||
          notif.notification_type === "Your project was Liked" ||
          notif.notification_type === "Your project was disliked"
        );
      })
    : [];

  let [isAllNotifications, setAllNotifications] = useState(true);
  let [isGroupNotifications, setGroupNotifications] = useState(false);
  let [isInteractionMessages, setInteractionMessages] = useState(false);

  // NUMBER OF UNREAD MESSAGES;

  let unreadGroup = groupMessages.filter((notif) => {
    return notif.read === false;
  }).length;
  let unreadInteractions = interactionMessages.filter((notif) => {
    return notif.read === false;
  }).length;
  
  let allNotificationsList;
  if (notifications) {
    allNotificationsList = notifications.map((notification) => {
      let timestamp = formatTimestamp(notification.created_at);
      let readStatus = notification.read ? "green" : "red";
      return (
        <div className="notification-pod">
          <div style={{ backgroundColor: readStatus }} id="read-status"></div>
          <div id="notif-details">
            <h5>{notification.message}</h5>
            <h6>{timestamp}</h6>
          </div>
        </div>
      );
    });
  }

  let groupNotificationsList = groupMessages.map((notification) => {
    let timestamp = formatTimestamp(notification.created_at);
    let readStatus = notification.read ? "green" : "red";
    return (
      <div className="notification-pod">
        <div style={{ backgroundColor: readStatus }} id="read-status"></div>
        <div id="notif-details">
          <h5>{notification.message}</h5>
          <h6>{timestamp}</h6>
        </div>
      </div>
    );
  });

  let interactionMessagesList = interactionMessages.map((notification) => {
    let timestamp = formatTimestamp(notification.created_at);
    let readStatus = notification.read ? "green" : "red";
    return (
      <div className="notification-pod">
        <div style={{ backgroundColor: readStatus }} id="read-status"></div>
        <div id="notif-details">
          <h5 className="comment-link">{notification.message}</h5>
          <h6>{timestamp}</h6>
        </div>
      </div>
    );
  });

  // toggling user notifications

  const [areNotificationsVisible, setNotificationsVisible] = useState();
  const [isUserProfileVisible, setUserProfileVisible] = useState();

  const profileClass = isUserProfileVisible ? "active" : "disabled";
  const notifClass = areNotificationsVisible ? "active" : "disabled";

  document.addEventListener("click", () => {
    setNotificationsVisible(false);
    setUserProfileVisible(false);
  });

  // toggling user category;

  let handleToggleNofitCategory = (left, width) => {
    let indicator = document.getElementById("notif-indicator");
    indicator.style.left = `${left}em`;
    indicator.style.width = `${width}em`;
  };

  let handleAllMessages = () => {
    setAllNotifications(true);
    setGroupNotifications(false);
    setInteractionMessages(false);
  };
  let handleGroupMessages = () => {
    setAllNotifications(false);
    setGroupNotifications(true);
    setInteractionMessages(false);
  };
  let handleInteractionMessages = () => {
    setAllNotifications(false);
    setGroupNotifications(false);
    setInteractionMessages(true);
  };

  return (
    <>
      <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="max-w-screen-xl flex justify-items-center mx-4 p-2">
          <a href="/" class="flex items-start">
          <img
              src={logo}
              class="h-12 mr-1"
              alt="ProTracker Logo"
            />
            
          </a>
          <div id="my_profile">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setNotificationsVisible(false);
                setUserProfileVisible(!isUserProfileVisible);
              }}
              id="current-user-pfp"
            >
              <NavLink to="/userprofile">
                <img src={userAvatarUrl}></img>
              </NavLink>
            </div>
            <div id="notif-cont">
              {unreadMessages.length > 0 && (
                <div id="notif-count">
                  <h6>{unreadMessages.length}</h6>
                </div>
              )}
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsVisible(!areNotificationsVisible);
                  setUserProfileVisible(false);
                }}
                className="material-icons"
              >
                notifications
              </i>
              <div
                className={`container-${notifClass}`}
                id="notifications-container"
              >
                <div id="pointer"></div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationsVisible(true);
                  }}
                  id="notif-container"
                >
                  <div id="notif-cont-header">
                    <div id="mark-as-done">
                      <h5>Notifications</h5>
                      <h6
                        onClick={() => {
                          markAsRead();
                        }}
                      >
                        Mark all as done
                      </h6>
                    </div>
                    <div id="notif-category">
                      <span
                        onClick={() => {
                          handleToggleNofitCategory(0.5, 6);
                          handleAllMessages();
                        }}
                      >
                        <i className="material-icons">all_inclusive</i>
                        <h6>All</h6>
                        {unreadMessages.length > 0 && (
                          <h5>{unreadMessages.length}</h5>
                        )}
                      </span>
                      <h6>.</h6>
                      <span
                        onClick={() => {
                          handleToggleNofitCategory(7, 7.2);
                          handleGroupMessages();
                        }}
                      >
                        <i className="material-icons">groups</i>
                        <h6>Groups</h6>
                        {unreadGroup > 0 && <h5>{unreadGroup}</h5>}
                      </span>{" "}
                      <h6>.</h6>
                      <span
                        onClick={() => {
                          handleToggleNofitCategory(15, 9.2);
                          handleInteractionMessages();
                        }}
                      >
                        <i>@</i>
                        <h6>Interactions</h6>
                        {unreadInteractions > 0 && (
                          <h5>{unreadInteractions}</h5>
                        )}
                      </span>{" "}
                    </div>
                    <div id="notif-indicator"></div>
                  </div>
                  <div id="notifications-box">
                    {isAllNotifications && allNotificationsList}
                    {isGroupNotifications && groupNotificationsList}
                    {isInteractionMessages && interactionMessagesList}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
