import { useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { showNotification, hideNotification } from "../toast/toastActions";
import "./resetPassword.css";

function NewPasswordEntry() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isChanged, setIsChanged] = useState(false);

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

  let email = localStorage.getItem("email");
  let sendToken = () => {
    setIsLoading(true);
    let obj = {
      email,
      password_reset_token: token,
      password: password,
    };
    if (password === passwordConfirmation) {
      fetch(`https://protracker-5hxf.onrender.com/password_reset/create`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }).then((response) => {
        if (response.ok) {
          setIsLoading(false);
          localStorage.removeItem("email");
          handleToast("Successfully changed password", "success", "primary");
          setTimeout(() => {
            setIsChanged(true);
          },2000);
        } else if (!response.ok) {
          setIsLoading(false);
          handleToast("Failed to update password", "error", "primary");
        }
      });
    } else {
      handleToast(
        "Password and password confirm must match",
        "error",
        "primary"
      );
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  if (isChanged) {
    return <Redirect exact to="/" />;
  }

  return (
    <div>
      <form id="reset-password-form" class="space-y-4 md:space-y-6" action="#">
        <h1 id="form-title">Enter new password :)</h1>
        <div>
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your token
          </label>
          <input
            onChange={(e) => {
              setToken(e.target.value);
            }}
            type="text"
            name="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder=""
            value={token}
            required
          />
        </div>
        <div>
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            New Password
          </label>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            name="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="...."
            value={password}
            required
          />
        </div>{" "}
        <div>
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Comfirm Password
          </label>
          <input
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
            }}
            type="password"
            name="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="...."
            value={passwordConfirmation}
            required
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            sendToken();
          }}
          type="submit"
          class="w-full text-red bg-primary-000 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Send Email
          {isLoading && (
            <div className="loader">
              <div className="ball-1"></div>
              <div className="ball-2"></div>
              <div className="ball-3"></div>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}

export default NewPasswordEntry;
