import React, { useEffect, useState } from "react";
import "./adminDashUsers.css";
import { useDispatch } from "react-redux";
import { showNotification, hideNotification } from "../toast/toastActions";

function AdminDashUsers() {
  // retrieving values stored in local storage;
  const token = localStorage.getItem("jwt");
  let storedUserId = localStorage.getItem("userId");

  // redux stuf yoh;

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

  // storing clicked user's information;
  const [userActionId, setUserActive] = useState(0);
  const [userName, setUserName] = useState("");

  // retrieving all users form the database;
  const [allUsers, setallUsers] = useState([]);
  const [allUsersSearch, setallUsersSearch] = useState([]);

  useEffect(() => {
    fetch("https://protracker-5hxf.onrender.com/all_users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setallUsers(data);
        setallUsersSearch(data);
        setIsFetching(true)
      });
  }, []);

  // banning and making admin
  const [isViewingUsers, setViewingUsers] = useState(true);
  const [isMakingAdmin, setMakingAdmin] = useState(false);
  const [isBanningUser, setBanningUser] = useState(false);

  // Granting a user admin rights;
  let handleMakingAdmin = () => {
    let userObj = { user_id: userActionId };
    fetch("https://protracker-5hxf.onrender.com/make_admin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(userObj),
    }).then((response) => {
      if (response.ok) {
        handleToast(
          "User successfully granted admin rights",
          "success",
          "primary"
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        handleToast("Could not grant user admin rights", "error", "primary");
      }
    });
  };

  // revoking admin rights;
  let handleRevokingAdminStatus = () => {
    let userObj = { user_id: userActionId };
    fetch("https://protracker-5hxf.onrender.com/remove_admin", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(userObj),
    }).then((response) => {
      if (response.ok) {
        handleToast("Successfully revoked admin rights", "success", "primary");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        handleToast("Could not revoke user admin rights", "error", "primary");
      }
    });
  };

  // searching for users;
  const [searchTerm, setSearchTerm] = useState("");

  const findUser = () => {
    let results = allUsersSearch.filter((user) => {
      return user.username.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setallUsers(results);
  };

  // user elements;
  let usersList = allUsers.map((user) => {
    let userRole = user.admin ? "Admin" : "Student";
    let online_status = user.online_status === "online" ? "green" : "red";
    let avatar_url =
      user.avatar_url === null
        ? "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
        : user.avatar_url;
    let isOwner = user.id == storedUserId || user.admin === true ? true : false;
    let cursorStyle = isOwner ? "not-allowed" : "pointer";
    let isOwnerRevoke = user.id == storedUserId ? true : false;
    let cursorStyleRevoke = isOwnerRevoke ? "not-allowed" : "pointer";

    return (
      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <th
          scope="row"
          class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
        >
          <img
            class="w-10 h-10 rounded-full"
            src={avatar_url}
            alt="Jese image"
          />
          <div class="pl-3">
            <div class="text-base font-semibold">{user.username}</div>
            <div class="font-normal text-gray-500">{user.email}</div>
          </div>
        </th>
        <td class="px-6 py-4">{userRole}</td>
        <td class="px-6 py-4">
          <div class="flex items-center">
            <div
              class={`h-2.5 w-2.5 rounded-full bg-${online_status}-500 mr-2`}
            ></div>{" "}
            {user.online_status}
          </div>
        </td>
        <td class="px-6 py-4">
          <button
            onClick={() => {
              setUserActive(user.id);
              setUserName(user.username);
              setMakingAdmin(true);
              setBanningUser(false);
            }}
            class="font-medium text-green-600 dark:text-blue-500 hover:underline"
            style={{ cursor: cursorStyle }}
            disabled={isOwner}
          >
            Make admin
          </button>
        </td>
        <td class="px-6 py-4">
          <button
            onClick={() => {
              setUserActive(user.id);
              setMakingAdmin(true);
              setBanningUser(true);
            }}
            class="font-medium text-red-600 dark:text-blue-500 hover:underline"
            style={{ cursor: cursorStyleRevoke }}
            disabled={isOwnerRevoke}
          >
            Revoke Admin
          </button>
        </td>
      </tr>
    );
  });

  const [isFetching, setIsFetching] = useState(false);

  return (
    <div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        {isFetching ? (
          <>
            {" "}
            <div class="flex items-center justify-between pb-4 bg-white dark:bg-gray-900">
              <label for="table-search" class="sr-only">
                Search
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for users by username"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    findUser();
                  }}
                  value={searchTerm}
                />
              </div>
            </div>
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="p-4">
                    <div class="flex items-center">
                      <label for="checkbox-all-search" class="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Position
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{usersList}</tbody>
            </table>
          </>
        ) : (
          <div className="page-loader">
            <div className="p-loader">
              <div className="p-ball-1"></div>
              <div className="p-ball-2"></div>
              <div className="p-ball-3"></div>
            </div>
          </div>
        )}
      </div>
      {isMakingAdmin && (
        <div
          onClick={() => {
            setMakingAdmin(false);
          }}
          id="user-activity-options-cont"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setMakingAdmin(true);
            }}
            id="admin-actions-modal"
          >
            {isBanningUser === true ? (
              <>
                <i
                  onClick={(e) => {
                    e.stopPropagation();
                    setMakingAdmin(false);
                  }}
                  id="close-btn"
                  className="material-icons"
                >
                  close
                </i>
                <div id="delete-info">
                  <h2>Revoke User Admin RIghts</h2>
                  <p>
                    Are you sure you want to ban this user? By doing this you
                    will revoke all the user's administraive rights.
                  </p>
                </div>
                <div id="delete-actions">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMakingAdmin(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleRevokingAdminStatus();
                    }}
                    id="delete-btn"
                  >
                    Revoke
                  </button>
                </div>
              </>
            ) : (
              <>
                <i
                  onClick={(e) => {
                    e.stopPropagation();
                    setMakingAdmin(false);
                  }}
                  id="close-btn"
                  className="material-icons"
                >
                  close
                </i>
                <div id="delete-info">
                  <h2>Make Admin</h2>
                  <p>
                    Are you sure you want to make the user <b>{userName}</b> an
                    admin? By doing this the user will will be granted
                    administrative rights.
                  </p>
                </div>
                <div id="delete-actions">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMakingAdmin(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleMakingAdmin();
                    }}
                    id="submit-btn"
                  >
                    Make Admin
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashUsers;
