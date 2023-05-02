import React, { useEffect, useState } from "react";
import "./comments.css";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { showNotification, hideNotification } from "../toast/toastActions";

const CommentReply = ({ reply, formatTimestamp, avatar_url }) => {
  let fomartedTimestamp = formatTimestamp(reply.created_at);

  let avatarUrl =
    avatar_url == null
      ? "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg"
      : avatar_url;

  return (
    <div id="custom-comment">
      <div id="profile-image-container">
        <img src={avatarUrl} alt="profile_img" />
      </div>
      <div id="content-box">
        <div id="project-comment">
          <h6 id="timestamp">{fomartedTimestamp}</h6>
          <p id="comment-content">{reply.message}</p>
        </div>
      
      </div>
    </div>
  );
};

const Comment = ({ comment, replies, formatTimestamp, avatar_url,handleToast }) => {
  
  const token = localStorage.getItem("jwt"); //store token in localStorage
  const userId = localStorage.getItem("userId");

  const [replyContent, setReplyContent] = useState("");

  let commentReplies = replies.filter(
    (rep) => rep.parent_comment_id === comment.id
  );

  const [filteredReplies, setFilteredReplies] = useState(commentReplies);

  const handleReplyingToComment = (value) => {
    let replyObj = {
      comment_id: comment.id,
      user_id: userId,
      message: replyContent,
      created_at: new Date(),
    };

    setFilteredReplies([...filteredReplies, replyObj]);

    commentReplies.push(replyObj);

    let obj = {
      comment_id: comment.id,
      user_id: userId,
      message: replyContent,
    };

    fetch("https://protracker-5hxf.onrender.com/comments/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(obj),
    }).then((response) => {
      if (response.ok) {
        handleToast("Reply sent!", "new", "secondary")
      } else {
        handleToast("Failed to send reply", "error", "secondary")
      }
    });

    setReplyContent("");
  };

  let commentRepliesList = filteredReplies.map((reply) => {
    return (
      <CommentReply
        formatTimestamp={formatTimestamp}
        reply={reply}
        key={reply.id}
        avatar_url={avatar_url}
      />
    );
  });

  let areRepliesAvailable = commentRepliesList.length > 0;

  let fomartedTimestamp = formatTimestamp(comment.created_at);

  let handleReplyToggle = (e) => {
    const replyBox = e.target.nextSibling;
    const replyBoxClass = replyBox.classList;
    const viewMoreTitle = e.target.firstElementChild;
    const viewMoreIcon = e.target.children[1];

    if (replyBoxClass.contains("reply-box-inactive")) {
      replyBoxClass.replace("reply-box-inactive", "reply-box-active");
      viewMoreTitle.textContent = "View less";
      viewMoreIcon.textContent = "expand_less";
    } else if (replyBoxClass.contains("reply-box-active")) {
      replyBoxClass.replace("reply-box-active", "reply-box-inactive");
      viewMoreTitle.textContent = "View all replies";
      viewMoreIcon.textContent = "expand_more";
    }
  };

  const [isReplying, setIsReplying] = useState(false);
  let toggleReplyForm = () => {
    setIsReplying(!isReplying);
  };
  let replyWord = commentRepliesList.length === 1 ? "reply" : "replies";
  let avatarUrl =
    avatar_url == null
      ? "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg"
      : avatar_url;

  return (
    <div id="custom-comment">
      <div id="profile-image-container">
        <img src={avatarUrl} alt="profile_img" />
      </div>
      <div id="content-box">
        <div id="project-comment">
          <h6 id="timestamp">{fomartedTimestamp}</h6>
          <p id="comment-content">{comment.message}</p>
          <div id="comment-details">
            <div>
              <h6>
                {commentRepliesList.length} {replyWord}
              </h6>
              &nbsp;&nbsp;
              <i className="material-symbols-outlined">chat</i>
            </div>
            <div
              onClick={() => {
                toggleReplyForm();
              }}
            >
              <h6>reply</h6>
              &nbsp;&nbsp;
              <i className="material-symbols-outlined">chat</i>
            </div>
          </div>
        </div>

        {isReplying && (
          <div id="reply-input-box">
            <textarea
              onChange={(e) => {
                setReplyContent(e.target.value);
              }}
              placeholder="what are your thoughts?"
              value={replyContent}
            ></textarea>
            <div id="reply-controls">
              <button
                onClick={() => {
                  toggleReplyForm();
                }}
                id="cancel-btn"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
              <button
                onClick={() => {
                  handleReplyingToComment();
                }}
                id="reply-btn"
              >
                <i className="material-symbols-outlined">send</i>
              </button>
            </div>
          </div>
        )}

        {areRepliesAvailable && (
          <div
            onClick={(e) => {
              handleReplyToggle(e);
            }}
            id="view-more"
          >
            <h6>View all replies</h6>
            <i className="material-icons">expand_more</i>
          </div>
        )}

        <div id="reply-box" className="reply-box-inactive">
          {commentRepliesList}
        </div>
      </div>
    </div>
  );
};

const CommentForm = ({ formatTimestamp, avatar_url }) => {
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

  const token = localStorage.getItem("jwt"); //store token in localStorage

  const projectId = localStorage.getItem("projectId");
  const userId = localStorage.getItem("userId");

  const [message, setMessage] = useState("");

  let handleCommenting = (message) => {
    setMessage(message);
  };

  let handlePosting = () => {
    let commentBox = document.getElementById("comments-box");

    let comment = {
      message: message,
      created_at: new Date(),
    };

    let comment_obj = {
      message: message,
      project_id: projectId,
      user_id: userId,
    };

    fetch("https://protracker-5hxf.onrender.com/comments/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(comment_obj),
    }).then((response) => {
      if (response.ok) {
        handleToast("Comment sent!", "new", "secondary");
      } else {
        handleToast("Comment not dent!", "error", "secondary");
      }
    });

    const newComment = (
      <Comment
        comment={comment}
        formatTimestamp={formatTimestamp}
        replies={[]}
        avatar_url={avatar_url}
      />
    );

    const newCommentContainer = document.createElement("div");
    newCommentContainer.classList.add("custom-comment");
    ReactDOM.render(newComment, newCommentContainer);

    commentBox.appendChild(newCommentContainer);

    setMessage("");
  };

  return (
    <div id="custom-comment-form">
      <input
        onChange={(e) => {
          handleCommenting(e.target.value);
        }}
        type="text"
        placeholder="Start typing..."
        value={message}
      ></input>
      <button
        onClick={() => {
          handlePosting();
        }}
      >
        <i className="material-icons">rocket_launch</i>
      </button>
    </div>
  );
};

function CommentBox() {

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

  const project_id = localStorage.getItem("projectId");
  const token = localStorage.getItem("jwt");

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

  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(
      `https://protracker-5hxf.onrender.com/comments/project_comments/${project_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      });
  }, [project_id]);

  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    fetch("https://protracker-5hxf.onrender.com/user_profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAvatarUrl(data.avatar_url);
      });
  }, []);

  let rootComments = comments.filter(
    (comment) => comment.parent_comment_id === null
  );

  let rootCommentsList = rootComments.map((comment) => {
    return (
      <Comment
        formatTimestamp={formatTimestamp}
        comment={comment}
        key={comment.id}
        avatar_url={avatar_url}
        replies={comment.replies}
        handleToast={handleToast}
      />
    );
  });
  return (
    <section id="comment-section">
      <div id="comments-box">{rootCommentsList}</div>
      <CommentForm
        project_id={project_id}
        formatTimestamp={formatTimestamp}
        avatar_url={avatar_url}
      />
    </section>
  );
}

export default CommentBox;
