import { useState, useEffect } from "react";
import CohortForm from "../../pages/Cohort";
import "./cohortlist.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import { showNotification, hideNotification } from "../toast/toastActions";

function CohortList() {
  // retrieve values from localStorage
  let role = localStorage.getItem("admin");
  const token = localStorage.getItem("jwt");

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

  let [clickedCohortId, setClickedCohortId] = useState("");

  // toggle create cohort form
  const [isCohortFormActive, setCohortFormActive] = useState();

  let handleCohortForm = () => {
    setCohortFormActive(!isCohortFormActive);
  };

  // Retrieving cohorts from database;
  const [cohorts, setCohorts] = useState([]);
  useEffect(() => {
    fetch("https://protracker-5hxf.onrender.com/cohorts/my_cohorts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCohorts(data);
        setFetching(true);
      });
  }, []);


  // store cohort id inlocalStorage;
  let handleCohortId = (value) => {
    localStorage.setItem("cohort_id", value);
  };

  

  let cohortlist = cohorts.map((cohort) => {
    return (
      <div className="cohort-card">
        <h1
          onClick={() => {
            handleCohortId(cohort.id);
          }}
          className="cohort-name"
        >
          <NavLink to="/projectList">{cohort.name}</NavLink>
        </h1>
        {role === true && (
          <button
            onClick={() => {
              handleCohortForm();
              setCreatingCohort(false);
              setClickedCohortId(cohort.id);
            }}
          >
            Add Member
          </button>
        )}
      </div>
    );
  });

  // custom rendering for creating a new cohort
  const [isCreatingCohort, setCreatingCohort] = useState(false);

  // retrieving all users in the database;

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
      });
  }, []);

  let handleAddingMemberToCohort = (id) => {
    let memberObj = {
      cohort_id: clickedCohortId,
      user_id: id,
    };
    fetch("https://protracker-5hxf.onrender.com/cohort/add_student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(memberObj),
    }).then((response) => {
      if (response.ok) {
        handleToast("Member successfully added", "success", "primary");
        setTimeout(() => {
          window.location.reload();
        }, 3100);
      } else {
        handleToast("Failed to add member", "error", "primary");
      }
    });
  };

  let allUsersList = allUsers.map((user) => {
    let adminStatus = user.admin ? "Admin" : "Student";
    let avatar_url =
      user.avatar_url === null
        ? "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
        : user.avatar_url;
    let onlineStatus = user.online_status === "online" ? "green" : "red";

    let onCohort = user.enrolled_cohorts
      ? user.enrolled_cohorts.filter((cohort) => {
          return cohort.id == clickedCohortId;
        })
      : [];

    let cursorType = onCohort.length > 0 ? "not-allowed" : "pointer";
    let btn_state = cursorType === "not-allowed" ? true : false;
    return (
      <div className="add-cohort-member">
        <div className="c-add-dp">
          <div className="pfp">
            <img src={avatar_url} />
            <div style={{ backgroundColor: onlineStatus }}></div>
          </div>
        </div>
        <div className="c-add-details">
          <h2>{user.username}</h2>
          <h3>{adminStatus}</h3>
        </div>
        <div className="c-add-btn">
          <button
            onClick={() => {
              handleAddingMemberToCohort(user.id);
            }}
            style={{ cursor: cursorType }}
            disabled={btn_state}
          >
            Add Member
          </button>
        </div>
      </div>
    );
  });

  const [searchTerm, setSearchTerm] = useState("");

  let findCohortStudent = () => {
    let results = allUsersSearch.filter((student) => {
      return student.username.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setallUsers(results);
  };

  // creating a cohort

  // loading status

  const [isLoading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [isStillLoading, setStillLoading] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [errorsArray, setErrorsArray] = useState([]);

  const [cohortData, setCohortData] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setCohortData({ ...cohortData, [name]: value });
  }

  function handleSubmit() {
    setLoading(true);
    fetch(`https://protracker-5hxf.onrender.com/cohorts/create_cohort`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify(cohortData),
    })
      .then((response) => {
        if (response.ok) {
          handleToast("Cohort created successfully", "success", "primary");
          setInterval(() => {
            window.location.reload();
          }, 3100);
          return response.json();
        } else {
          return response.json().then((error) => {
            let errorMessage = error.errors[0];
            handleToast(`${errorMessage}`, "error", "primary");
          });
        }
      })
      .then((data) => {
        if (data.errors.length > 0) {
          setErrorsArray(data.errors);
        } else {
          setErrorsArray([]);
        }
      })
      .catch((error) => {});
  }

  return (
    <section>
      <div id="cohort-header">
        <div id="coohort-path">
          <div id="path-col">
            <h6>Cohort &gt; </h6>
            <h2>All Cohorts</h2>
          </div>
        </div>
        {role === "true" && (
          <div id="cohort-list-options-col">
            <button
              onClick={() => {
                handleCohortForm();
                setCreatingCohort(true);
              }}
            >
              Create Cohort
            </button>
          </div>
        )}
      </div>
      <div id="cohort-body">
        <div id="cohorts-box">
          {isFetching &&
            (cohorts.length > 0 ? (
              cohortlist
            ) : (
              <div>
                <h6 id="msg-alert">
                  You have not been enrolled in any cohorts yet :(
                </h6>
              </div>
            ))}
          {isFetching || (
            <div className="page-loader">
              <div className="p-loader">
                <div className="p-ball-1"></div>
                <div className="p-ball-2"></div>
                <div className="p-ball-3"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isCohortFormActive && (
        <div
          onClick={() => {
            handleCohortForm();
          }}
          className="create-cohort-cont"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              setCohortFormActive(true);
            }}
            id="create-cohort-box"
          >
            {isCreatingCohort ? (
              <CohortForm
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                cohortData={cohortData}
                setCohortData={setCohortData}
              />
            ) : (
              <div id="add-cohort-form">
                <div className="add-cohort-header">
                  <input
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      findCohortStudent();
                    }}
                    type="text"
                    value={searchTerm}
                  />
                  <i className="material-icons">search</i>
                </div>
                <div className="add-cohort-body">
                  {allUsersList.length > 0 ? (
                    allUsersList
                  ) : (
                    <h1 className="no-results-msg">No users found</h1>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default CohortList;
