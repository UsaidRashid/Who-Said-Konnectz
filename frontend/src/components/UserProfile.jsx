import React, { useEffect, useState } from "react";
import profile from "../Images/profile.png";
import axios from "axios";
import ChatBox from "./Chatbox";
import { jwtDecode } from "jwt-decode";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/Features/postSlice";
import { toggleLike, toggleLikeComment } from "../store/Features/postSlice";

export default function Profile(props) {
  const [user, setUser] = useState({ friends: [] });
  const [token, setToken] = useState();
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestRecieved, setRequestRecieved] = useState(false);
  const [openDM, setOpenDM] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userId, setUserId] = useState(null);

  const dispatch = useDispatch();

  const posts = useSelector((state) => state.post.posts);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setUser(props.user);
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setToken(decodedToken);
      if (
        props.user &&
        decodedToken &&
        decodedToken?.user?.friends?.some(
          (friend) => friend._id === props.user._id
        )
      ) {
        setIsFriend(true);
      }
      if (
        props.user &&
        decodedToken &&
        decodedToken?.user?.requestsSent?.some(
          (friend) => friend._id === props.user._id
        )
      ) {
        setRequestSent(true);
      }

      if (
        props.user &&
        decodedToken &&
        decodedToken?.user?.requestsRecieved?.some(
          (friend) => friend._id === props.user._id
        )
      ) {
        setRequestRecieved(true);
      }
      setUserId(decodedToken.user._id);
    }
  }, [props.user]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log(user._id);
        const response = await axios.post(
          "http://localhost:3002/posts/fetch-individual",
          { _id: user._id }
        );

        dispatch(
          setPosts(
            response.data.posts.map((post) => ({
              ...post,
              isLiked: post.likes.includes(userId),
              _id: post._id,
              content: post.content,
              author: post.author.name,
              username: post.author.username,
              postPic: post.postPic,
              profilePic: post.author.profilePic,
              likes: post.likes,
              comments: post.comments.map((comment) => ({
                ...comment,
                isCommentLiked: comment.likes.includes(userId),
              })),
            }))
          )
        );
      } catch (error) {
        console.error("Error in fetching individual posts:", error);
        console.log(error.response?.data?.message || "An error occurred");
        if (error.response) {
          alert(
            "Error from server: " +
              error.response.status +
              " - " +
              error.response.data.message
          );
        } else if (error.request) {
          alert("No response from the server");
        } else {
          alert("Error setting up the request: " + error.message);
        }
      }
    };

    if (user._id) fetchPosts();
  }, [user._id, userId]);

  async function newPost() {
    navigate("/newpost");
  }

  const handleCommentLike = async (comment, postId) => {
    try {
      if (!userId) {
        alert("You must be logged in");
        navigate("/login");
        return;
      }
      if (!comment) {
        alert("Comment not found");
        return;
      }
      const commentId = comment._id;
      const response = await axios.post(
        "http://localhost:3002/comments/toggleLike",
        { commentId, userId }
      );
      if (response.status === 401) {
        alert("You must be Logged in!");
        navigate("/login");
      }
      if (response.status === 200) {
        dispatch(toggleLikeComment({ commentId, userId, postId }));
      } else {
        console.error("Error liking Comment:", response.data.message);
      }
    } catch (error) {
      console.error("Error in toggling like :", error);
      console.log(error.response?.data?.message || "An error occurred");
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const handleLike = async (post) => {
    try {
      if (!userId) {
        alert("You must be logged in");
        navigate("/login");
        return;
      }
      if (!post) {
        alert("Post not found");
        return;
      }
      const postId = post._id;

      const response = await axios.put(
        `http://localhost:3002/posts/toggleLike`,
        { userId, postId }
      );

      if (response.status === 401) {
        alert("You must be Logged in!");
        navigate("/login");
      }
      if (response.status === 200) {
        dispatch(toggleLike({ postId, userId }));
      } else {
        console.error("Error liking post:", response.data.message);
      }
    } catch (error) {
      console.error("Error in toggling like:", error);
      console.log(error.response?.data?.message || "An error occurred");
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    try {
      if (!userId) {
        alert("You must be logged in");
        navigate("/login");
        return;
      }
      const content = e.target.elements[`commentText-${postId}`].value;
      const response = await axios.post("http://localhost:3002/comments/new", {
        postId,
        author: userId,
        content,
      });

      if (response.status === 200) {
        alert("Comment created successfully");
        window.location.reload();
      } else {
        console.error("Error Commenting on post:", response.data.message);
      }
    } catch (error) {
      console.error("Error in Commenting :", error);
      console.log(error.response?.data?.message || "An error occurred");
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const addFriend = async () => {
    try {
      if (!token) {
        alert("You must be logged in!");
        return;
      }
      if (!user) {
        alert("User not found");
        return;
      }
      const response = await axios.post(
        "http://localhost:3002/send-friend-request",
        {
          toId: user._id,
          fromId: token.user._id,
        }
      );
      if (response.status === 200) {
        alert("Friend Request Sent Successfully");
        setToken(response.data.token);
        setRequestSent(true);
        localStorage.setItem("token", response.data.token);
      } else {
        alert(response.data.message || "Error Adding Friend");
      }
    } catch (error) {
      console.error("Error Adding Friend:", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const removeFriend = async (req, res) => {
    try {
      const response = await axios.post("http://localhost:3002/remove-friend", {
        toId: user._id,
        fromId: token.user._id,
      });
      if (response.status === 200) {
        alert("Friend Removed Successfully");
        setToken(response.data.token);
        setIsFriend(false);
        localStorage.setItem("token", response.data.token);
      } else {
        alert(response.data.message || "Error Adding Friend");
      }
    } catch (error) {
      console.error("Error Removing Friend:", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const handleAccept = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3002/accept-friend-request",
        {
          fromId: user._id,
          toId: token.user._id,
        }
      );
      if (response.status === 200) {
        alert("Friend Request Accepted Successfully");
        localStorage.clear();
        localStorage.setItem("token", response.data.token);
        window.location.reload();
      } else {
        alert(response.data.message || "Error Accepting Request");
      }
    } catch (error) {
      console.error("Error Accepting Friend Request:", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3002/reject-friend-request",
        {
          fromId: user._id,
          toId: token.user._id,
        }
      );
      if (response.status === 200) {
        alert("Friend Request Rejected Successfully");
        localStorage.clear();
        localStorage.setItem("token", response.data.token);
        window.location.reload();
      } else {
        alert(response.data.message || "Error Accepting Request");
      }
    } catch (error) {
      console.error("Error Rejecting Friend Request:", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const handleDeletePost = async (_id) => {
    try {
      const response = await axios.post(
        "http://localhost:3002/posts/delete-post",
        { _id }
      );
      if (response.status === 200) {
        alert("Post Deleted Successfully!");
        window.location.reload();
      } else {
        alert(response.data.message || "Error Deleting Post!");
      }
    } catch (error) {
      console.error("Error Deleting Post:", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  const handleConfirmUnfriend = () => {
    removeFriend();
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="relative overflow-hidden bg-emerald-100">
        {openDM ? (
          <ChatBox fromId={token.user._id} toId={user._id} />
        ) : (
          <div
            className="container m-20 p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
            style={{ width: "87%" }}
          >
            <div className="container rounded bg-white mb-4">
              <div className="row">
                <div className="col-md-7 border-right">
                  <div className="d-flex flex-column align-items-center text-center p-5">
                    <img
                      className="rounded-circle mt-5 transition-transform transform hover:scale-110 duration-300 ease-in-out"
                      width="150px"
                      height="150px"
                      src={user.profilePic || profile}
                      alt="Profile"
                    />
                  </div>
                </div>
                <div className="col-md-5 border-right">
                  <div className="p-3 py-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="text-right fw-bold fs-4 transition-transform transform hover:translate-x-2 duration-300 ease-in-out">
                        User Profile
                      </h4>
                    </div>
                    <div className="row mt-1">
                      <div className="col-md-12">
                        <label className="labels fw-bold fs-5">Name</label>
                        <p className="fs-5">{user?.name}</p>
                      </div>
                      <div className="col-md-12">
                        <label className="labels fw-bold fs-5">Username</label>
                        <p className="fs-5">{user?.username}</p>
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col-md-12">
                        <label className="labels fw-bold fs-5">Email ID</label>
                        <p className="fs-5">{user?.email}</p>
                      </div>
                      <div className="col-md-12">
                        <label className="labels fw-bold fs-5">
                          Mobile Number
                        </label>
                        <p className="fs-5">{user?.contact}</p>
                      </div>
                    </div>
                    {token && token?.user?._id !== user?._id && (
                      <div className="d-flex flex-row justify-content-evenly w-75 my-3 pt-3">
                        {isFriend ? (
                          <>
                            <button
                              className="btn btn-primary transition-opacity duration-300 ease-in-out hover:opacity-100"
                              style={{ opacity: 0.7 }}
                              onClick={() => setShowConfirmModal(true)}
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="me-2"
                              />
                              Friends
                            </button>
                            <button
                              className="btn btn-success transition-transform duration-300 ease-in-out hover:scale-105"
                              onClick={() => setOpenDM(true)}
                            >
                              Message
                            </button>
                          </>
                        ) : requestSent ? (
                          <button className="btn btn-primary" disabled>
                            Request Sent!
                          </button>
                        ) : requestRecieved ? (
                          <div className="mt-3">
                            <p>{user.name} sent you a friend request!</p>
                            <div className="flex space-x-2">
                              <button
                                className="btn btn-success transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={handleAccept}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger transition-transform duration-300 ease-in-out hover:scale-105"
                                onClick={handleReject}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary transition-transform duration-300 ease-in-out hover:scale-105"
                            onClick={addFriend}
                          >
                            Add Friend
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Modal
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Unfriend</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to remove {user.name} from your friends?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmUnfriend}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <div>
          <div className="container my-48 w-75">
            {posts && posts.length > 0 ? (
              <div className="d-flex flex-column gap-4 mx-60">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="card border-emerald-600 border-3 mb-4"
                    style={{
                      border: "1px solid #4CAF50",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      boxShadow: "0 20px 50px rgba(76, 175, 80, 0.4)",
                    }}
                  >
                    <div className="card-body p-4 w-100">
                      <div className="d-flex align-items-center mb-3 w-100">
                        <img
                          src={post.profilePic}
                          alt=""
                          height="50px"
                          width="50px"
                          className="rounded-circle border border-emerald-600"
                          style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
                        />
                        <div className="ms-3">
                          <h5 className="card-title text-emerald-600 mb-0">
                            {post.author}
                          </h5>
                          <small className="text-muted">@{post.username}</small>
                        </div>
                        {user?._id === token?.user?._id && (
                          <button
                            className="btn btn-danger rounded-pill ms-auto"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            Delete Post!
                          </button>
                        )}
                      </div>

                      <p className="card-text my-4 font-monospace text-center">
                        {post.content}
                      </p>

                      {post.postPic && (
                        <img
                          src={post.postPic}
                          alt=""
                          className="img-fluid border border-emerald-600"
                          style={{
                            borderRadius: "8px",
                            padding: "4px",
                            boxShadow: "0 0 5px #4CAF50",
                            height: "100%",
                            width: "100%",
                          }}
                        />
                      )}
                      <div className="my-3 text-center">
                        <span className="badge bg-primary text-dark me-2">
                          {post.likes.length} Likes
                        </span>
                        <span className="badge bg-primary text-dark">
                          {post.comments.length} Comments
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center position-absolute bottom-0 start-0 w-100 bg-white">
                        <button
                          className={`btn btn-transparent text-emerald-600 d-flex align-items-center justify-content-center w-50
                      // {post.isLiked ? "text-danger" : "text-success"} 
                    `}
                          onClick={() => handleLike(post)}
                          style={{
                            borderWidth: "1px",
                            borderStyle: "solid",
                            transition: "border-color 0.3s ease",
                          }}
                        >
                          {!post.isLiked ? (
                            <i className="fas fa-thumbs-up me-2"></i>
                          ) : (
                            <i class="fa-solid fa-thumbs-down"></i>
                          )}

                          {post.isLiked ? "Unlike" : "Like"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-transparent text-emerald-600 d-flex align-items-center justify-content-center w-50"
                          data-bs-toggle="modal"
                          data-bs-target={`#commentsModal-${post._id}`}
                          style={{
                            borderWidth: "1px",
                            borderStyle: "solid",
                            transition: "border-color 0.3s ease",
                          }}
                        >
                          <i className="fas fa-comment me-2"></i>Comments
                        </button>
                      </div>
                    </div>

                    <div
                      className="modal fade slide-up-modal"
                      id={`commentsModal-${post._id}`}
                      tabIndex="-1"
                      aria-labelledby={`commentsModalLabel-${post._id}`}
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5
                              className="modal-title"
                              id={`commentsModalLabel-${post._id}`}
                            >
                              Comments
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="d-flex flex-column gap-4">
                              {post.comments.map((comment) => (
                                <div
                                  key={comment._id}
                                  className="card border-emerald-600 shadow-lg mb-4"
                                  style={{
                                    border: "1px solid #4CAF50",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                      <img
                                        src={comment.author.profilePic}
                                        alt=""
                                        height="50px"
                                        width="50px"
                                        className="rounded-circle border border-emerald-600"
                                        style={{
                                          objectFit: "cover",
                                          aspectRatio: "1 / 1",
                                        }}
                                      />
                                      <div className="ms-3">
                                        <h5 className="card-title text-emerald-600 mb-0">
                                          {comment.author.name}
                                        </h5>
                                        <small className="text-muted">
                                          @{comment.author.username}
                                        </small>
                                      </div>
                                    </div>
                                    <p className="card-text mb-4 font-monospace text-center">
                                      {comment.content}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <button
                                        className={`btn btn-transparent text-emerald-600 d-flex align-items-center justify-content-center w-50
                                   // comment.isCommentLiked ? "text-danger" : ""
                                  `}
                                        style={{
                                          borderWidth: "1px",
                                          borderStyle: "solid",
                                          transition: "border-color 0.3s ease",
                                        }}
                                        onClick={() =>
                                          handleCommentLike(comment, post._id)
                                        }
                                      >
                                        {!comment.isCommentLiked ? (
                                          <i className="fas fa-thumbs-up me-2"></i>
                                        ) : (
                                          <i class="fa-solid fa-thumbs-down"></i>
                                        )}
                                        {comment.isCommentLiked
                                          ? "Unlike"
                                          : "Like"}
                                      </button>
                                      <span className="badge bg-primary text-dark me-5">
                                        {comment.likes.length} Likes
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <form
                              onSubmit={(e) => handleAddComment(e, post._id)}
                            >
                              <div className="mb-3">
                                <label
                                  htmlFor={`commentText-${post._id}`}
                                  className="form-label"
                                >
                                  Your comment
                                </label>
                                <textarea
                                  className="form-control"
                                  id={`commentText-${post._id}`}
                                  rows="3"
                                  required
                                ></textarea>
                              </div>
                              <button type="submit" className="btn btn-primary">
                                Add Comment!
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No posts found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
