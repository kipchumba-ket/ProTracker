import React, { useEffect, useState } from "react";
import "./projectdetails.css";

import { useSelector, useDispatch } from "react-redux";
import { showNotification, hideNotification } from "../toast/toastActions";

import CommentBox from "../comments/CommentBox";
import react from "./assets/react.png";
import Github from "./assets/github.png";
import html from "./assets/html.png";
import javascript from "./assets/javascript.png";
import angular from "./assets/angular.png";
import mongo from "./assets/mongodb.png";
import postgres from "./assets/postgresql.png";
import redux from "./assets/tailwind-css.png";
import ruby from "./assets/ruby.png";
import next from "./assets/next.png";
import bootstrap from "./assets/bootstrap.png";
import rails from "./assets/rails.png";
import css from "./assets/css3.png";
import tailwind from "./assets/tailwind-css.png";

import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function Projectdetails() {
  const token = localStorage.getItem("jwt"); //store token in localStorage
  const cohort_id = localStorage.getItem("cohort_id");
  const storedProjectId = localStorage.getItem("projectId");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

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

  // updating redux state;
  function handleProjectId(newId) {
    dispatch({ type: "SET_PROJECT_ID", payload: newId });
  }

  const [modalGroupMembers, setGroupMembers] = useState([]);

  // states for conditional rendering;
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isAddingNewMember, setIsAddingNewMember] = useState(false);
  const [isCheckingMembers, setIsCheckingMembers] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);

  let toggleAddMemberForm = (e) => {
    setIsAddingMember(!isAddingMember);
    e.stopPropagation();
  };

  const [projectData, setProjectData] = useState({});
  const [projectOwner, setProjectOwner] = useState({});

  useEffect(() => {
    fetch(
      `https://protracker-5hxf.onrender.com//projects/${storedProjectId}/project_details`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setGroupMembers(data.members);
        setProjectData(data);
        setProjectOwner(data.user);
      });
  }, []);

  let ownerName = projectOwner.username || "loading...";
  let ownerAvatar =
    projectOwner.avatar_url ||
    "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg";

  // user details;
  let projectName = projectData ? projectData.project_name : "loading...";
  let projectDescription = projectData
    ? projectData.project_description
    : "loading...";
  let githubLink = projectData ? projectData.github_link : "loading...";
  let groupMembers = projectData ? projectData.members : "loading...";
  let tags = projectData.tags || [];

  // tag images
  let images = {
    html: html,
    javascript: javascript,
    angular: angular,
    mongo: mongo,
    redux: redux,
    postgres: postgres,
    ruby: ruby,
    next: next,
    bootstrap: bootstrap,
    rails: rails,
    css: css,
    tailwind: tailwind,
    react: react,
  };

  let imageArray;
  if (projectData.tags !== null) {
    imageArray = tags.map((item) => ({
      name: item.name,
      image: images[item.name],
    }));
  }

  let tagsList;
  if (projectData.tags !== null) {
    tagsList = imageArray.map((tag) => {
      return <img src={tag.image}></img>;
    });
  }

  // refactoring member component

  const Member = ({ member, avatar_url }) => {
    return (
      <div id="group-member-box">
        <div id="group-member-pfp">
          <img src={avatar_url}></img>
        </div>
        <div id="group-member-details">
          <h1>{member.username}</h1>
          <h6>Project Member</h6>
        </div>
      </div>
    );
  };

  // group members for the details page;
  let membersList;
  if (projectData.members) {
    membersList = groupMembers.map((member) => {
      let avatar_url =
        member.avatar_url === null
          ? "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
          : member.avatar_url;
      return <Member member={member} avatar_url={avatar_url} />;
    });
  }

  // group members for the members modal;
  let groupMembersList;
  if (projectData.members) {
    groupMembersList = modalGroupMembers.map((member) => {
      let avatar_url =
        member.avatar_url === null
          ? "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
          : member.avatar_url;
      return (
        <div className="members-list-member">
          <Member member={member} avatar_url={avatar_url} />
        </div>
      );
    });
  }

  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  // searching for group members
  const findGroupMembers = () => {
    let members = projectData.members;

    // filter members by search term
    let results = members.filter((member) => {
      return member.username
        .toLowerCase()
        .includes(memberSearchTerm.toLowerCase());
    });

    setGroupMembers(results);
  };

  const [cohortMembers, setCohortMembers] = useState([]);
  const [cohortMembersSearch, setCohortMembersSearch] = useState([]);
  const [cohortMembersReset, setCohortMembersReset] = useState([]);

  useEffect(() => {
    fetch(
      `https://protracker-5hxf.onrender.com/cohort/${cohort_id}/cohort_members`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCohortMembers(data);
        setCohortMembersSearch(data);
        setCohortMembersReset(data);
      });
  }, []);

  let handleAddingMember = (id) => {
    const memberObj = { id, project_id: storedProjectId };

    fetch(
      `https://protracker-5hxf.onrender.com/cohort/${cohort_id}/project/add_member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(memberObj),
      }
    )
      .then((response) => {
        if (response.ok) {
          handleToast("Member successfully added", "success", "primary");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          handleToast("Failed to add member", "error", "primary");
        }
      })
      .then((data) => {});
  };

  const [cohortMemberSearchTerm, setcohortMemberSearchTerm] = useState("");
  // searching for group members
  const findCohortMembers = () => {
    if (cohortMemberSearchTerm == "") {
      setCohortMembers(cohortMembersReset);
      return;
    }
    // filter members by search term
    let results = cohortMembersSearch.filter((member) => {
      return member.username
        .toLowerCase()
        .includes(cohortMemberSearchTerm.toLowerCase());
    });

    setCohortMembers(results);
  };

  let cohortMembersList = cohortMembers.map((member) => {
    let avatar_url =
      member.avatar_url === null
        ? "https://i.pinimg.com/736x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg"
        : member.avatar_url;

    let indicatorColor = member.online_status === "offline" ? "red" : "green";

    let enrolled = member.enrolled_projects.filter((project) => {
      return project.id == storedProjectId;
    });

    let cursorType = enrolled.length > 0 ? "not-allowed" : "pointer";
    let btn_state = cursorType === "not-allowed" ? true : false;

    return (
      <div className="group-cohort-member">
        <div className="cohort-member-pfp">
          <img src={avatar_url} alt="" />
          <div
            style={{ backgroundColor: indicatorColor }}
            className="online-indicator"
          ></div>
        </div>
        <div className="cohort-member-details">
          <h3>{member.username}</h3>
          <button
            onClick={() => {
              handleAddingMember(member.id);
            }}
            id="member-add-btn"
            style={{ cursor: cursorType }}
            disabled={btn_state}
          >
            Add member
          </button>
        </div>
      </div>
    );
  });

  // updating an exisiting project;

  const [isUpdatingProject, setUpdatingProject] = useState(false);
  const [updatedprojectName, setProjectName] = useState("");
  const [updatedprojectDescription, setProjectDescription] = useState("");
  const [updatedcategory, setCategory] = useState("Fullstack");
  const [updatedgithubLink, setGithubLink] = useState("");

  const handleUpdateProjectDetails = () => {
    sePosting(true);
    let newProjectObj = {
      project_name: updatedprojectName || projectData.project_name,
      project_description:
        updatedprojectDescription || projectData.project_description,
      github_link: updatedgithubLink || projectData.github_link,
      category: updatedcategory || projectData.category,
    };
    fetch(`https://protracker-5hxf.onrender.com/projects/${projectData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newProjectObj),
    }).then((response) => {
      if (response.ok) {
        sePosting(false);
        handleToast(
          "Project details updated successfully",
          "success",
          "tertiary"
        );
        setUpdatingProject(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        sePosting(false);
        handleToast("Failed to update project", "error", "tertiary");
      }
    });
  };

  const [isPosting, sePosting] = useState(false);

  //  deleting an existing project;

  const [isDeletingProject, setDeletingProject] = useState(false);

  return (
    <>
      <section id="project-details-container">
        <NavLink to="/projectList">
          <i id="backward-btn" className="material-icons">
            arrow_backwards
          </i>
        </NavLink>
        <div id="project-details-header">
          <h1 id="project-name">{projectName}</h1>
          {userId == projectData.user_id ? (
            <div id="project-options">
              <button
                onClick={(e) => {
                  toggleAddMemberForm(e);
                  setIsAddingNewMember(true);
                }}
                id="add-member-btn"
              >
                Add member
              </button>
              <button
                onClick={() => {
                  setIsMenuActive(!isMenuActive);
                }}
                id="project-more-options"
              >
                <i className="material-icons">more_horiz</i>
              </button>
              {isMenuActive && (
                <div id="project-menu">
                  <div
                    onClick={() => {
                      setUpdatingProject(true);
                      setDeletingProject(false);
                    }}
                  >
                    <h6>Update</h6>
                  </div>
                  {role === true && (
                    <div
                      onClick={() => {
                        setUpdatingProject(true);
                        setDeletingProject(true);
                      }}
                    >
                      <h6>Delete</h6>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div id="project-details-body">
          <div className="details-body-col details-col">
            <h1 id="col-title" style={{}}>
              PROJECT DETAILS
            </h1>
            <div id="project-details">
              <div className="project-details-row description-row">
                <h1 id="row-title">Description</h1>
                <p id="project-desc">{projectDescription}</p>
                <a href={githubLink} target="_blank">
                  <img id="github_link" src={Github}></img>
                </a>
                <br />
                <h6>Technologies Used :</h6>
                <div className="technologies-cont ">{tagsList}</div>
                <div id="project-owner-box">
                  <div id="owner-pfp">
                    <img src={ownerAvatar}></img>
                  </div>
                  <div id="owner-details">
                    <h1>{ownerName}</h1>
                    <h6>Project Owner</h6>
                  </div>
                </div>
                <div id="project-members-box">
                  <div id="members-container">{membersList}</div>

                  <div id="view-more-members">
                    <h1
                      onClick={(e) => {
                        toggleAddMemberForm(e);
                        setIsAddingNewMember(false);
                      }}
                    >
                      View all members ({groupMembers ? groupMembers.length : 0}
                      )
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="details-body-col comments-col">
            <CommentBox project_id={projectData.id} />
          </div>
        </div>
      </section>
      {isAddingMember && (
        <div
          onClick={(e) => {
            toggleAddMemberForm(e);
          }}
          id="add-member-form-cont"
        >
          {isAddingNewMember ? (
            <div
              className="add-members-container"
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingMember(true);
              }}
            >
              <div className="add-members-modal-header">
                <input
                  type="text"
                  placeholder="Find members..."
                  onChange={(e) => {
                    setcohortMemberSearchTerm(e.target.value);
                    findCohortMembers();
                  }}
                  value={cohortMemberSearchTerm}
                ></input>
                <i className="material-icons">search</i>
              </div>
              <div className="add-members-modal-body">
                {cohortMembersList.length > 0 ? (
                  cohortMembersList
                ) : (
                  <h1 className="no-results-msg">No users found</h1>
                )}
              </div>
            </div>
          ) : (
            isCheckingMembers || (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingMember(true);
                }}
                id="members-modal"
              >
                <div className="members-modal-header">
                  <input
                    onChange={(e) => {
                      setMemberSearchTerm(e.target.value);
                      findGroupMembers();
                    }}
                    type="text"
                    placeholder="Find members..."
                    value={memberSearchTerm}
                  ></input>
                  <i className="material-icons">search</i>
                </div>
                <div className="members-modal-body">
                  {groupMembersList.length > 0 ? (
                    groupMembersList
                  ) : (
                    <h1 className="no-results-msg">No Users found...</h1>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
      {isUpdatingProject && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setUpdatingProject(false);
            setDeletingProject(true);
          }}
          id="project-update-container"
        >
          {isDeletingProject === false ? (
            <form
              onClick={(e) => {
                e.stopPropagation();
                setUpdatingProject(true);
              }}
            >
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdatingProject(false);
                }}
                id="close-btn"
                className="material-icons"
              >
                close
              </i>
              <h1 id="form-title">Update Project</h1>
              <div className="form-group">
                <label>Project name</label>
                <input
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                  type="text"
                  value={updatedprojectName}
                ></input>
              </div>
              <div className="form-group">
                <label>Project description</label>
                <textarea
                  onChange={(e) => {
                    setProjectDescription(e.target.value);
                  }}
                  type="text"
                  value={updatedprojectDescription}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Class</label>
                <select
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                >
                  <option>Fullstack</option>
                  <option>Android</option>
                </select>
              </div>
              <div className="form-group">
                <label>Github link</label>
                <input
                  onChange={(e) => {
                    setGithubLink(e.target.value);
                  }}
                  type="text"
                  value={updatedgithubLink}
                ></input>
              </div>
              <br />
              <br />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleUpdateProjectDetails();
                }}
                id="create-project-btn"
              >
                Create project
                {isPosting && (
                  <div className="loader">
                    <div className="ball-1"></div>
                    <div className="ball-2"></div>
                    <div className="ball-3"></div>
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setUpdatingProject(true);
              }}
              id="delete-box"
            >
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdatingProject(false);
                }}
                id="close-btn"
                className="material-icons"
              >
                close
              </i>
              <div id="delete-info">
                <h2>Delete Project</h2>
                <p>
                  Are you sure you want to delete this project? By doing this
                  you will lose all of this project's data and will not be able
                  retrieve it.
                </p>
              </div>
              <div id="delete-actions">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUpdatingProject(false);
                  }}
                >
                  Cancel
                </button>
                <button id="delete-btn">Delete</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Projectdetails;
