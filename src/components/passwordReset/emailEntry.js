import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { showNotification, hideNotification } from "../toast/toastActions";
import "./resetPassword.css";

function EmailEntry() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

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

  let handleSendingEmail = () => {
    setIsLoading(true);
    let emailBody = {
      email: email,
    };
    fetch(`https://protracker-5hxf.onrender.com/password_reset/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailBody),
    }).then((response) => {
      if (response.ok) {
        localStorage.setItem("email", email);
        setEmailSent(true);
        setIsLoading(false);
        handleToast("Email sent successfully", "success", "primary");
      } else if (!response.ok) {
        setIsLoading(false);
        handleToast("Error sending email", "error", "primary");
      }
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  if (emailSent) {
    return <Redirect to="/newpass" />;
  }

  return (
    <div>
      <form
        id="reset-password-form"
        class="space-y-4 md:space-y-6 relative"
        action="#"
      >
        <NavLink exact to="/">
          <i
            style={{ position: "absolute", top: "10px", left: "10px" }}
            className="material-icons"
          >
            arrow_backwards
          </i>
        </NavLink>
        <h1 id="form-title">Enter email you registered with :)</h1>
        <div>
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            name="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@company.com"
            value={email}
            required=""
          />
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            handleSendingEmail();
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

export default EmailEntry;
