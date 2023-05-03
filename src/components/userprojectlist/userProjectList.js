import React, { useState, useEffect } from "react";
import "./userProjectList.css";
import android from "./assets/android.png";
import fullstack from "./assets/code.png";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

import { useDispatch } from "react-redux";
import { showNotification, hideNotification } from "../toast/toastActions";

function UserProjectList() {
  let userId = localStorage.getItem("userId");
  let role = localStorage.getItem("admin");
  const token = localStorage.getItem("jwt"); //store token in localStorage
  const cohort_id = localStorage.getItem("cohort_id");

  // handling project filter dropdown logic

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

  const [isDropDownActive, setDropDownActive] = useState(false);
  const [filterField, setFilterField] = useState("All projects");

  let dropDownClass = isDropDownActive
    ? "dropdown-active"
    : "dropdown-disabled";
  let dropDownIcon = isDropDownActive ? "expand_less" : "expand_more";

  // fetching projects;
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(
      `https://protracker-5hxf.onrender.com/cohort/${cohort_id}/all_projects`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setIsFetching(false);
      });
  }, []);

  // updating redux state;
  function handleProjectId(newId) {
    localStorage.setItem("projectId", newId);
  }

  // handle liking projects

  let handleLikingProject = (id, event, likes, liked, checked_state) => {
    const isChecked = event.target.checked;
    let h6Elem = event.target.nextSibling.nextSibling;
    let isLiked = liked.length > 0;

    if (!isLiked) {
      event.target.style.color = "blueViolet !important";
      h6Elem.innerHTML = "";
      h6Elem.innerHTML = likes + 1;
      fetch(`https://protracker-5hxf.onrender.com/projects/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        if (response.ok) {
          handleToast("Liked", "new", "secondary");
        } else {
          handleToast("Failed", "error", "secondary");
        }
      });
    } else {
      event.target.style.color = "black !important";
      h6Elem.innerHTML = "";
      h6Elem.innerHTML = likes - 1;
      fetch(`https://protracker-5hxf.onrender.com/projects/${id}/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        if (response.ok) {
          handleToast("Unliked", "new", "secondary");
        } else {
          handleToast("Failed", "error", "secondary");
        }
      });
    }
  };

  // creating an element for each project

  let androidProjects = projects.filter((project) => {
    return project.category === "Android";
  });
  let fullstackProjects = projects.filter((project) => {
    return project.category === "Fullstack";
  });

  const [isViewingAllProjects, setViewingAllProjects] = useState(true);
  const [isViewingAndroidProjects, setViewingAndroidProjects] = useState(false);
  const [isViewingFullStackProjects, setViewingFullStackProjects] =
    useState(false);

  let viewAllProjects = () => {
    setViewingAllProjects(true);
    setViewingAndroidProjects(false);
    setViewingFullStackProjects(false);
  };

  let viewAndroidProjects = () => {
    setViewingAllProjects(false);
    setViewingAndroidProjects(true);
    setViewingFullStackProjects(false);
  };

  let viewFullStackProjects = () => {
    setViewingAllProjects(false);
    setViewingAndroidProjects(false);
    setViewingFullStackProjects(true);
  };

  let projectsList = projects.map((project) => {
    let avatar_url =
      project.user.avatar_url === null
        ? "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
        : project.user.avatar_url;

    let indicatorColor =
      project.user.online_status === "offline" ? "red" : "green";

    let likes = project.student_likes.length;

    let liked = project.student_likes.filter((student) => {
      return student.id == userId;
    });
    let color_button = liked.length > 0 ? "blueViolet" : "";
    let checked_state = liked.length > 0 ? true : false;

    let image_src = project.category === "Android" ? android : fullstack;

    return (
      <div className="project-card">
        <div className="image-container">
          <img src={image_src}></img>
        </div>
        <div className="project-info">
          <h1>{project.project_name}</h1>
          <h6>
            {" "}
            <NavLink
              onClick={() => {
                handleProjectId(project.id);
              }}
              to="/projectdetails"
            >
              <h2>View</h2>
            </NavLink>
          </h6>
        </div>
        <div id="user-project-info">
          <div id="project-info-menu"></div>
          <div id="project-add-info">
            <span id="fave-span">
              <input
                onChange={(e) => {
                  handleLikingProject(
                    project.id,
                    e,
                    likes,
                    liked,
                    checked_state
                  );
                }}
                type="checkbox"
                id="fave-box"
              />
              <i
                style={{ color: color_button }}
                id="like-button"
                className="material-icons"
              >
                favorite
              </i>
              <h6>{likes}</h6>
            </span>
            <div id="project-owner-details">
              <div id="project-owner-dp">
                <img src={avatar_url} alt="avatar" />
                <div style={{ backgroundColor: indicatorColor }}></div>
              </div>
              <span>
                <h1>{project.user.username}</h1>
                <h6>Project owner</h6>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  });

  let androidProjectsList = androidProjects.map((project) => {
    let avatar_url =
      project.user.avatar_url === null
        ? "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
        : project.user.avatar_url;

    let indicatorColor =
      project.user.online_status === "offline" ? "red" : "green";

    let likes = project.student_likes.length;

    let liked = project.student_likes.filter((student) => {
      return student.id == userId;
    });
    let color_button = liked.length > 0 ? "blueViolet" : "";
    let checked_state = liked.length > 0 ? true : false;

    let image_src = project.category === "Android" ? android : fullstack;

    return (
      <div className="project-card">
        <div className="image-container">
          <img src={image_src}></img>
        </div>
        <div className="project-info">
          <h1>{project.project_name}</h1>
          <h6>
            {" "}
            <NavLink
              onClick={() => {
                handleProjectId(project.id);
              }}
              to="/projectdetails"
            >
              <h2>View</h2>
            </NavLink>
          </h6>
        </div>
        <div id="user-project-info">
          <div id="project-info-menu"></div>
          <div id="project-add-info">
            <span id="fave-span">
              <input
                onChange={(e) => {
                  handleLikingProject(
                    project.id,
                    e,
                    likes,
                    liked,
                    checked_state
                  );
                }}
                type="checkbox"
                id="fave-box"
              />
              <i
                style={{ color: color_button }}
                id="like-button"
                className="material-icons"
              >
                favorite
              </i>
              <h6>{likes}</h6>
            </span>
            <div id="project-owner-details">
              <div id="project-owner-dp">
                <img src={avatar_url} alt="avatar" />
                <div style={{ backgroundColor: indicatorColor }}></div>
              </div>
              <span>
                <h1>{project.user.username}</h1>
                <h6>Project owner</h6>
              </span>
            </div>
          </div>
        </div>
        {/* <div id="project-card-menu-icon">
          <i className="material-icons">more_horiz</i>
          <input type="checkbox" id="menu-checkbox"></input>
          <div id="card-menu-box"></div>
        </div> */}
      </div>
    );
  });

  let fullstackProjectsList = fullstackProjects.map((project) => {
    let avatar_url =
      project.user.avatar_url === null
        ? "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
        : project.user.avatar_url;

    let indicatorColor =
      project.user.online_status === "offline" ? "red" : "green";

    let likes = project.student_likes.length;

    let liked = project.student_likes.filter((student) => {
      return student.id == userId;
    });
    let color_button = liked.length > 0 ? "blueViolet" : "";
    let checked_state = liked.length > 0 ? true : false;

    let image_src = project.category === "Android" ? android : fullstack;

    return (
      <div className="project-card">
        <div className="image-container">
          <img src={image_src}></img>
        </div>
        <div className="project-info">
          <h1>{project.project_name}</h1>
          <h6>
            {" "}
            <NavLink
              onClick={() => {
                handleProjectId(project.id);
              }}
              to="/projectdetails"
            >
              <h2>View</h2>
            </NavLink>
          </h6>
        </div>
        <div id="user-project-info">
          <div id="project-info-menu"></div>
          <div id="project-add-info">
            <span id="fave-span">
              <input
                onChange={(e) => {
                  handleLikingProject(
                    project.id,
                    e,
                    likes,
                    liked,
                    checked_state
                  );
                }}
                type="checkbox"
                id="fave-box"
              />
              <i
                style={{ color: color_button }}
                id="like-button"
                className="material-icons"
              >
                favorite
              </i>
              <h6>{likes}</h6>
            </span>
            <div id="project-owner-details">
              <div id="project-owner-dp">
                <img src={avatar_url} alt="avatar" />
                <div style={{ backgroundColor: indicatorColor }}></div>
              </div>
              <span>
                <h1>{project.user.username}</h1>
                <h6>Project owner</h6>
              </span>
            </div>
          </div>
        </div>
        {/* <div id="project-card-menu-icon">
          <i className="material-icons">more_horiz</i>
          <input type="checkbox" id="menu-checkbox"></input>
          <div id="card-menu-box"></div>
        </div> */}
      </div>
    );
  });

  // toggling add projects form;

  const [isProjectFormActive, setIsProjectFormActive] = useState(false);

  let handleProjectForm = () => {
    setIsProjectFormActive(!isProjectFormActive);
  };

  // adding projects form

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [newCategory, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [githubLink, setGithubLink] = useState("");

  function handleCheckBox(value, event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      setTags((tags) => [...tags, value]);
    } else {
      setTags((tags) => tags.filter((tag) => tag !== value));
    }
  }

  let createNewProject = () => {
    setIsLoading(true);
    let projObj = {
      cohort_id: cohort_id,
      project_name: projectName,
      project_description: projectDescription,
      category: newCategory,
      github_link: githubLink,
      tags: tags,
    };
    fetch("https://protracker-5hxf.onrender.com/projects/add_project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(projObj),
    }).then((response) => {
      if (response.ok) {
        setIsLoading(false);
        handleProjectForm();
        handleToast("Project created successfully", "success", "primary");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setIsLoading(false);
        return response.json().then((error) => {
          let errorMessage = error.errors[0];
          handleToast(`${errorMessage}`, "error", "primary");
        });
      }
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isfetching, setIsFetching] = useState(true);

  return (
    <section id="user-project-list">
      <div id="project-list-header">
        <div id="path-col">
          <h6>Cohort > Projects</h6>
          <h2>All Projects</h2>
        </div>
        <div id="project-list-options-col">
          <button
            onClick={() => {
              setDropDownActive(!isDropDownActive);
            }}
          >
            <h6>{filterField}</h6>
            <i className="material-icons">{dropDownIcon}</i>
          </button>
          <div className={dropDownClass} id="projects-drop-down">
            <div
              onClick={() => {
                setFilterField("All Projects");
                setDropDownActive(!isDropDownActive);
                viewAllProjects();
              }}
            >
              <h6>All Projects</h6>
            </div>
            <div
              onClick={() => {
                setFilterField("Android");
                setDropDownActive(!isDropDownActive);
                viewAndroidProjects();
              }}
            >
              <h6>Android</h6>
            </div>
            <div
              onClick={() => {
                setFilterField("Fullstack");
                setDropDownActive(!isDropDownActive);
                viewFullStackProjects();
              }}
            >
              <h6>Fullstack</h6>
            </div>
          </div>
          <button
            onClick={() => {
              handleProjectForm();
            }}
          >
            Add Project
          </button>
        </div>
      </div>
      <div id="main-project-body">
        <div id="projects-body">
          {isfetching ? (
            <div className="page-loader">
              <div className="p-loader">
                <div className="p-ball-1"></div>
                <div className="p-ball-2"></div>
                <div className="p-ball-3"></div>
              </div>
            </div>
          ) : (
            <>
              {isViewingAllProjects &&
                (projectsList.length > 0 ? (
                  projectsList
                ) : (
                  <h1 id="msg-alert">No projects found :)</h1>
                ))}
              {isViewingAndroidProjects &&
                (androidProjectsList.length > 0 ? (
                  androidProjectsList
                ) : (
                  <h1 id="msg-alert">No projects found :)</h1>
                ))}
              {isViewingFullStackProjects &&
                (fullstackProjectsList.length > 0 ? (
                  fullstackProjectsList
                ) : (
                  <h1 id="msg-alert">No projects found :)</h1>
                ))}
            </>
          )}
        </div>
      </div>
      {isProjectFormActive && (
        <div
          onClick={() => {
            handleProjectForm();
          }}
          id="add-project-cont"
        >
          <form
            onClick={(e) => {
              e.stopPropagation();
              setIsProjectFormActive(true);
            }}
          >
            <h1 id="form-title">Add Project</h1>
            <div className="form-group">
              <label>Name</label>
              <input
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
                type="text"
                name="title"
                value={projectName}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                }}
                value={projectDescription}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Gihub link</label>
              <input
                onChange={(e) => {
                  setGithubLink(e.target.value);
                }}
                type="url"
                name="title"
                value={githubLink}
              />
            </div>

            <div className="form-group">
              <label>Categories</label>
              <select
                onClick={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="Fullstack">Fullstack</option>
                <option value="Android">Android</option>
              </select>
            </div>

            <div className="form-group">
              <label>Technologies</label>
              <div id="tags-container">
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="react"
                  ></input>
                  <h6>React</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="tailwind"
                  ></input>
                  <h6>Tailwind</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="bootstrap"
                  ></input>
                  <h6>Bootstrap</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="html"
                  ></input>
                  <h6>Html</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="css"
                  ></input>
                  <h6>Css</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="mongo"
                  ></input>
                  <h6>Mongo</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="postgres"
                  ></input>
                  <h6>Postgres</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="ruby"
                  ></input>
                  <h6>Ruby</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="rails"
                  ></input>
                  <h6>Rails</h6>
                </div>
                <div>
                  <input
                    onChange={(e) => {
                      handleCheckBox(e.target.value, e);
                    }}
                    type="checkbox"
                    className="tag-checkbox"
                    value="ruby"
                  ></input>
                  <h6>Ruby</h6>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                createNewProject();
              }}
              id="create-project-btn"
            >
              Create project
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
      )}
    </section>
  );
}

export default UserProjectList;
