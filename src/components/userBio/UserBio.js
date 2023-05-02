import React, { useEffect } from "react";
import "./UserBio.css";
import { useState } from "react";
import stellarproject from "./Assets/Kikombe (1).png";
import workhorse from "./Assets/medal (1).png";
import teamplayer from "./Assets/Crown.png";
import prolificCreator from "./Assets/Star Trophy.png";
import { useDispatch } from "react-redux";
import { showNotification, hideNotification } from "../toast/toastActions";

function UserBio() {
  let token = localStorage.getItem("jwt");

  // selecting user avatars logic

  const [isAvatarBoxAcive, setAvatarBoxActive] = useState(false);

  // redux stuff;

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

  let imageArray = [];

  const avatarboxclass = isAvatarBoxAcive ? "active" : "inactive";

  // toggling between viewing bio and updating bio;

  const [isViewingBio, setViewingBioActive] = useState(true);

  // handle category indicator;

  let [isViewingMyProjects, setViewingMyProjects] = useState(true);
  let [isViewingLikedProjects, setViewingLikedProjects] = useState(false);

  let indicatorClassName = isViewingMyProjects ? "active" : "disabled";
  let likesClassName = isViewingLikedProjects ? "active" : "disabled";

  let handleProjectCategoryIndicator = (event) => {
    let indicator = document.getElementById("p-indicator");
    let leftValue = event.target.offsetLeft;
    let width = event.target.offsetWidth;
    indicator.style.left = leftValue + "px";
    indicator.style.width = width + "px";
  };

  // fetching user details from server

  const [userdetails, setUserDetails] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [likedProjects, setLikedProjects] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetch("https://protracker-5hxf.onrender.com/user_profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserDetails(data);
        setUserProjects(data.projects);
        setAssignedProjects(data.enrolled_projects);
        setLikedProjects(data.liked_projects);
        setAchievements(data.achievements);
      });
  }, []);

  let username = userdetails.username;
  let userBio = userdetails.bio || "Looking good :)";
  let github_link = userdetails.github_link;
  let avaturl =
    userdetails.avatar_url ||
    "https://i.pinimg.com/564x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg";

  const [viewAllProjects, setViewAllProjects] = useState(true);
  const [viewLikedProjects, setViewLikedProjects] = useState(false);
  const [viewAssignedProjects, setViewAssignedProject] = useState(false);

  let checkOutAllProjects = () => {
    setViewAllProjects(true);
    setViewLikedProjects(false);
    setViewAssignedProject(false);
  };

  let checkOutAllLikedProjects = () => {
    setViewAllProjects(false);
    setViewLikedProjects(true);
    setViewAssignedProject(false);
  };

  let checkOutAllAssignedProjects = () => {
    setViewAllProjects(false);
    setViewLikedProjects(false);
    setViewAssignedProject(true);
  };

  let userProjectsList = userProjects.map((project) => {
    return (
      <div className="u-project-pod">
        <h6>{project.project_name}</h6>
        <div id="project-stats">
          <span>
            <i className="material-icons">favorite</i>
            <h5>{project.student_likes.length}</h5>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25"
              viewBox="0 0 24 24"
              fill="black"
              id="comment"
            >
              <path d="M18,2H6A3,3,0,0,0,3,5V16a3,3,0,0,0,3,3H8.59l2.7,2.71A1,1,0,0,0,12,22a1,1,0,0,0,.65-.24L15.87,19H18a3,3,0,0,0,3-3V5A3,3,0,0,0,18,2Zm1,14a1,1,0,0,1-1,1H15.5a1,1,0,0,0-.65.24l-2.8,2.4L9.71,17.29A1,1,0,0,0,9,17H6a1,1,0,0,1-1-1V5A1,1,0,0,1,6,4H18a1,1,0,0,1,1,1Z"></path>
            </svg>{" "}
            <h5>{project.comments.length}</h5>
          </span>
        </div>
      </div>
    );
  });

  let userLikedProjectsList = likedProjects.map((project) => {
    return (
      <div className="u-project-pod">
        <h6>{project.project_name}</h6>
        <div id="project-stats">
          <span>
            <i className="material-icons">favorite</i>
            <h5>{project.student_likes.length}</h5>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25"
              viewBox="0 0 24 24"
              fill="black"
              id="comment"
            >
              <path d="M18,2H6A3,3,0,0,0,3,5V16a3,3,0,0,0,3,3H8.59l2.7,2.71A1,1,0,0,0,12,22a1,1,0,0,0,.65-.24L15.87,19H18a3,3,0,0,0,3-3V5A3,3,0,0,0,18,2Zm1,14a1,1,0,0,1-1,1H15.5a1,1,0,0,0-.65.24l-2.8,2.4L9.71,17.29A1,1,0,0,0,9,17H6a1,1,0,0,1-1-1V5A1,1,0,0,1,6,4H18a1,1,0,0,1,1,1Z"></path>
            </svg>{" "}
            <h5>{project.comments.length}</h5>
          </span>
        </div>
      </div>
    );
  });

  let userAssignedProjectsList = assignedProjects.map((project) => {
    return (
      <div className="u-project-pod">
        <h6>{project.project_name}</h6>
        <div id="project-stats">
          <span>
            <i className="material-icons">favorite</i>
            <h5>{project.student_likes.length}</h5>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25"
              viewBox="0 0 24 24"
              fill="black"
              id="comment"
            >
              <path d="M18,2H6A3,3,0,0,0,3,5V16a3,3,0,0,0,3,3H8.59l2.7,2.71A1,1,0,0,0,12,22a1,1,0,0,0,.65-.24L15.87,19H18a3,3,0,0,0,3-3V5A3,3,0,0,0,18,2Zm1,14a1,1,0,0,1-1,1H15.5a1,1,0,0,0-.65.24l-2.8,2.4L9.71,17.29A1,1,0,0,0,9,17H6a1,1,0,0,1-1-1V5A1,1,0,0,1,6,4H18a1,1,0,0,1,1,1Z"></path>
            </svg>{" "}
            <h5>{project.comments.length}</h5>
          </span>
        </div>
      </div>
    );
  });

  // updating user profile details

  const [updatedUserName, setUserName] = useState("");
  const [updatedGithub, setUpdateGithub] = useState("");
  const [updatedBio, setUpdateBio] = useState("");
  const [updatedPassword, setUpdatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  let handleProfileUpdate = () => {
    setIsLoading(true)
    let profileObject = {
      username: updatedUserName || username,
      github_link: updatedGithub || github_link,
      bio: updatedBio || userBio,
      password: updatedPassword,
    };
    if (updatedPassword !== "" && updatedPassword !== confirmPassword) {
      handleToast("Password mismatch", "error", "tertiary");
      setIsLoading(false)
      return;
    }
    fetch("https://protracker-5hxf.onrender.com/update_profile", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify(profileObject),
    }).then((response) => {
      if (response.ok) {
        setIsLoading(false)
        handleToast("Profile updated successfully", "new", "tertiary");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setIsLoading(false)
        handleToast("Could not update profile", "error", "tertiary");
      }
    });
  };

  // picking avatar logic

  let avatarArray = [
    "https://i.pinimg.com/564x/20/57/6e/20576e2fea1a3eb2b760dfb6d846d7d8.jpg",
    "https://i.pinimg.com/564x/86/38/3f/86383f344c66e9c8d3e487cc18e81b30.jpg",
    "https://i.pinimg.com/564x/da/2c/2a/da2c2a1627a18605c7c309470231da59.jpg",
    "https://i.pinimg.com/564x/14/cc/2a/14cc2a3f8559f8ed86efb28e33b5c749.jpg",
    "https://i.pinimg.com/564x/21/39/8d/21398d375e0e5977de20fe4c7e6e1e0c.jpg",
    "https://i.pinimg.com/564x/18/78/5d/18785dd07c09465d01beef679baf1846.jpg",
    "https://i.pinimg.com/564x/3e/b3/f3/3eb3f34ccea3c7d84a415a261cf9cd08.jpg",
    "https://i.pinimg.com/564x/67/b3/cd/67b3cd153f8bfd2d816d98b5c4d7a038.jpg",
  ];

  let updateAvatar = (avatar, e) => {
    setAvatarUrl(avatar);
    e.preventDefault();
    let loader = e.target;
    let obj = {
      avatar_url: avatar,
    };
    loader.classList.remove("avatar-inactive");
    loader.classList.add("avatar-active");
    fetch("https://protracker-5hxf.onrender.com/update_avatar", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify(obj),
    }).then((response) => {
      if (response.ok) {
        handleToast("Avatar updated successfully", "success", "tertiary");
        setTimeout(() => {
          window.location.reload();
        }, 3100);
      } else {
        handleToast("Could not update avatar", "error", "tertiary");
      }
    });
  };

  let colors = ["#5b7ee8", "#f4d005", "f405a4", "#05f4cc"];

  let images = {
    Stellar_Project: stellarproject,
    Work_Horse: workhorse,
    Team_Player: teamplayer,
    Prolific_Creator: prolificCreator,
  };

  let imagesArray = achievements.map((item) => ({
    name: item.name,
    image: images[item.name.replace(" ", "_")],
    description: item.description,
  }));


  let achievementsList = imagesArray.map((achievement) => {
    return (
      <div className="achievement-pod">
        <img src={achievement.image} alt="achievement" />
        <div className="decription-box">
          <div id="img-cont">
            <img src={achievement.image} alt="achievement"></img>
          </div>
          <div id="achievement-details">
            <h2>{achievement.name}</h2>
            <hr />
            <p>{achievement.description}</p>
          </div>
        </div>
      </div>
    );
  });

  let avatarList = avatarArray.map((avatar) => {
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          updateAvatar(avatar, e);
        }}
        className="avatar-pod avatar-inactive"
      >
        <div className="pod-img-cont">
          <img src={avatar} alt="avatar"></img>
        </div>
        {/* <div className="avatar-loader"></div> */}
      </div>
    );
  });
  

  const[isLoading, setIsLoading] = useState(false)

  return (
    <section
      onClick={() => {
        setAvatarBoxActive(false);
      }}
      id="user-bio-section"
    >
      <div id="user-bio-container">
        <div id="user-details">
          <div className="user-details-col profile-col">
            <div id="user-profile-picture">
              <div id="picture-cont">
                <img id="main-dp" src={avaturl}></img>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setAvatarBoxActive(!isAvatarBoxAcive);
                }}
                id="edit-dp-container"
              >
                <h6>Edit</h6>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setAvatarBoxActive(true);
                }}
                className={`avatar-container-${avatarboxclass}`}
                id="avatar-container"
              >
                <div id="bio-pointer"></div>
                <div id="avatar-box">
                  <h6>Choose your avatar</h6>
                  <div id="avatar-grid">{avatarList}</div>
                </div>
              </div>
            </div>
            <div id="achievements-box">{achievementsList}</div>
          </div>
          <div className="user-details-col info-col">
            {isViewingBio ? (
              <>
                <div id="update-profile-cont">
                  <button
                    onClick={() => {
                      setViewingBioActive(false);
                    }}
                  >
                    <i className="material-icons">edit</i>
                    Update profile
                  </button>
                </div>
                <h1 id="user-username">{username}</h1>
                <div id="bio_box">
                  <h2 className="section-header">BIO</h2>
                  <p id="bio-text">{userBio}</p>
                </div>
                <div id="contacts-box">
                  <h2 className="section-header">CONTACTS</h2>
                  <div id="link-box">
                    <div>
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 128 96"
                        height="17"
                        id="email"
                        fill="#6b6b6b"
                      >
                        <path
                          d="M0 11.283V8a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8v3.283l-64 40zm66.12 48.11a4.004 4.004 0 0 1-4.24 0L0 20.717V88a8 8 0 0 0 8 8h112a8 8 0 0 0 8-8V20.717z"
                          data-name="Layer 2"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                        id="facebook"
                        fill="#6b6b6b"
                      >
                        <path d="M15.12,5.32H17V2.14A26.11,26.11,0,0,0,14.26,2C11.54,2,9.68,3.66,9.68,6.7V9.32H6.61v3.56H9.68V22h3.68V12.88h3.06l.46-3.56H13.36V7.05C13.36,6,13.64,5.32,15.12,5.32Z"></path>
                      </svg>
                    </div>
                    <div>
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 33.867 33.867"
                        id="linkedin"
                        fill="#6b6b6b"
                      >
                        <path
                          d="M5.692 1.058a3.33 3.33 0 0 0-3.308 3.33 3.33 3.33 0 0 0 3.33 3.33 3.33 3.33 0 0 0 3.329-3.33 3.33 3.33 0 0 0-3.33-3.33 3.33 3.33 0 0 0-.02 0zM3.97 10.38c-.88 0-1.588.708-1.588 1.588v19.262c0 .88.708 1.587 1.588 1.587h3.344c.88 0 1.587-.708 1.587-1.587V11.967c0-.88-.708-1.588-1.587-1.588H3.969zm9.732 0c-.88 0-1.588.708-1.588 1.588v19.262c0 .88.708 1.587 1.588 1.587h3.344c.88 0 1.587-.708 1.587-1.587V20.27c2.077-2.761 6.338-1.946 6.338 1.59v9.368c0 .88.708 1.587 1.588 1.587h3.344c.88 0 1.587-.708 1.587-1.587v-12.84c0-6.363-9.752-8.03-12.857-4.851v-1.571c0-.88-.708-1.588-1.587-1.588H13.7z"
                          paint-order="fill markers stroke"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="25"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                        id="twitter"
                        fill="#6b6b6b"
                      >
                        <path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div id="update-form-container">
                <form>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      onChange={(e) => {
                        setUserName(e.target.value);
                      }}
                      type="text"
                      value={updatedUserName}
                    ></input>
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      onChange={(e) => {
                        setUpdateBio(e.target.value);
                      }}
                      type="text"
                      value={updatedBio}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Github link</label>
                    <input
                      onChange={(e) => {
                        setUpdateGithub(e.target.value);
                      }}
                      type="text"
                      value={updatedGithub}
                    ></input>
                  </div>
                  <div id="password-div">
                    <div id="password-confirm" className="form-group">
                      <label>Password</label>
                      <input
                        onFocus={() => {
                          document.getElementById(
                            "confirm-password"
                          ).style.visibility = "visible";
                        }}
                        onChange={(e) => {
                          setUpdatePassword(e.target.value);
                        }}
                        type="password"
                        value={updatedPassword}
                      ></input>
                    </div>
                    <div id="confirm-password" className="form-group">
                      <label>Confirm Password</label>
                      <input
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                        }}
                        type="password"
                        value={confirmPassword}
                      ></input>
                    </div>
                  </div>
                  <div id="form-buttons">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleProfileUpdate();
                      }}
                      style={{border: '1px solid #999', display : "flex", alignItems : 'center', justifyContent : 'center'}}
                    >
                      Save
                      {
                    isLoading &&
                  <div className="loader">
                      <div className="ball-1"></div>
                      <div className="ball-2"></div>
                      <div className="ball-3"></div>

                  </div>}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setViewingBioActive(true);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        <div id="user-data">
          <div id="user-data-header">
            <div id="data-category">
              <div
                id="first-category"
                onClick={(e) => {
                  handleProjectCategoryIndicator(e);
                  checkOutAllProjects();
                }}
              >
                <h6>Projects</h6>
              </div>
              <div
                className={`p-category-${likesClassName}`}
                onClick={(e) => {
                  checkOutAllAssignedProjects();
                  handleProjectCategoryIndicator(e);
                }}
              >
                <h6>Assigned</h6>
              </div>
              <div
                className={`p-category-${likesClassName}`}
                onClick={(e) => {
                  handleProjectCategoryIndicator(e);
                  checkOutAllLikedProjects();
                }}
              >
                <h6>Liked</h6>
              </div>
              <div id="p-indicator"></div>
            </div>
          </div>
          <div id="user-data-container">
            {viewAllProjects && userProjectsList}
            {viewLikedProjects && userLikedProjectsList}
            {viewAssignedProjects && userAssignedProjectsList}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserBio;
