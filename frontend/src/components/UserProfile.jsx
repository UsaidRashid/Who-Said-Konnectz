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
const api = import.meta.env.VITE_BACKEND_URL;

export default function Profile(props) {
  const [user, setUser] = useState({ friends: [] });
  const [token, setToken] = useState();
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestRecieved, setRequestRecieved] = useState(false);
  const [openDM, setOpenDM] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const response = await axios.post(api + "posts/fetch-individual", {
          _id: user._id,
        });

        dispatch(
          setPosts({
            posts: response.data.posts.map((post) => ({
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
            })),
          })
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
      } finally {
        setLoading(false);
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
      const response = await axios.post(api + "comments/toggleLike", {
        commentId,
        userId,
      });
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

      const response = await axios.put(api + `posts/toggleLike`, {
        userId,
        postId,
      });

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
      const response = await axios.post(api + "comments/new", {
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
      const response = await axios.post(api + "send-friend-request", {
        toId: user._id,
        fromId: token.user._id,
      });
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
      const response = await axios.post(api + "remove-friend", {
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
      const response = await axios.post(api + "accept-friend-request", {
        fromId: user._id,
        toId: token.user._id,
      });
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
      const response = await axios.post(api + "reject-friend-request", {
        fromId: user._id,
        toId: token.user._id,
      });
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
      const response = await axios.post(api + "posts/delete-post", { _id });
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
      {openDM ? (
        <ChatBox fromId={token.user._id} toId={user._id} />
      ) : (
        <div
          className="relative overflow-hidden bg-emerald-100 mx-auto"
          style={{
            width: "700px",
          }}
        >
          <div className="container w-5/6 my-48 p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
            <div className="container rounded bg-white mb-4">
              <div className="flex flex-col align-items-center">
                <div className="col-md-7 border-right">
                  <div className="d-flex flex-column align-items-center text-center p-5 py-5">
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
                  </div>
                  {token && token?.user?._id !== user?._id && (
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                      {isFriend ? (
                        <>
                          <button
                            className="btn btn-primary transition-opacity duration-300 ease-in-out hover:opacity-100"
                            style={{ opacity: 0.7 }}
                            onClick={() => setShowConfirmModal(true)}
                          >
                            <FontAwesomeIcon icon={faCheck} className="mr-2" />
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
                          <div className="flex gap-2 mt-2">
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
          <p>Are you sure you want to remove {user.name} from your friends?</p>
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
      <>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div
                className="text-2xl font-bold text-emerald-600 mb-16"
                style={{ animation: "glow 1.5s infinite alternate" }}
              >
                Fetching Latest Posts...
                <p>Hang up tight!</p>
              </div>
              <div className="relative flex justify-center items-center">
                <div
                  className="absolute w-24 h-24 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"
                  style={{ animationDuration: "1s" }}
                ></div>
              </div>
            </div>

            <style>{`
                @keyframes glow {
                  from {
                    text-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
                  }
                  to {
                    text-shadow: 0 0 20px rgba(76, 175, 80, 1);
                  }
                }
              `}</style>
          </div>
        ) : (
          <div className="container my-12 mx-auto px-4">
            {posts && posts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="card rounded-lg overflow-hidden relative mx-auto"
                    style={{
                      border: "1px solid #4CAF50",
                      boxShadow: "0 10px 20px rgba(76, 175, 80, 0.8)",
                      minWidth: "600px",
                      maxWidth: "600px",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={post.profilePic}
                          alt=""
                          className="h-12 w-12 rounded-full border border-emerald-600"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="ml-3">
                          <h5 className="text-emerald-600 text-lg font-semibold mb-0">
                            {post.author}
                          </h5>
                          <small className="text-gray-500">
                            @{post.username}
                          </small>
                        </div>
                        {user?._id === token?.user?._id && (
                          <button
                            className="btn btn-danger rounded-pill ms-auto mt-3 md:mt-0"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            Delete Post!
                          </button>
                        )}
                      </div>

                      <p className="my-4 font-monospace text-center">
                        {post.content}
                      </p>

                      {post.postPic && (
                        <img
                          src={post.postPic}
                          alt=""
                          className="w-full rounded-lg p-1"
                          style={{
                            border: "2px solid #4CAF50",
                            boxShadow: "0 6px 12px rgba(76, 175, 80, 0.6)",
                            height: "auto",
                          }}
                        />
                      )}
                      <div className="mb-5 mt-4 text-center">
                        <div className="flex justify-center gap-2 mb-2">
                          <span
                            className="bg-emerald-600 text-white rounded-full px-3 py-1 text-sm font-semibold"
                            style={{ display: "inline-block" }}
                          >
                            {post.likes.length} Likes
                          </span>
                          <span
                            className="bg-emerald-600 text-white rounded-full px-3 py-1 text-sm font-semibold"
                            style={{ display: "inline-block" }}
                          >
                            {post.comments.length} Comments
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center absolute bottom-0 left-0 w-full bg-white p-2">
                        <button
                          className="btn btn-transparent text-emerald-600 flex items-center justify-center w-1/2 border border-transparent transition-colors duration-300 ease-in-out hover:border-emerald-600"
                          onClick={() => handleLike(post)}
                        >
                          {!post.isLiked ? (
                            <i className="fas fa-thumbs-up me-2"></i>
                          ) : (
                            <i className="fa-solid fa-thumbs-down"></i>
                          )}
                          {post.isLiked ? "Unlike" : "Like"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-transparent text-emerald-600 flex items-center justify-center w-1/2 border border-transparent transition-colors duration-300 ease-in-out hover:border-emerald-600"
                          data-bs-toggle="modal"
                          data-bs-target={`#commentsModal-${post._id}`}
                        >
                          <i className="fas fa-comment me-2"></i>Comments
                        </button>
                      </div>
                    </div>

                    <div
                      className="modal fade"
                      id={`commentsModal-${post._id}`}
                      tabIndex="-1"
                      aria-labelledby={`commentsModalLabel-${post._id}`}
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div
                          className="modal-content"
                          style={{
                            border: "1px solid #4CAF50",
                            borderRadius: "0.5rem",
                            boxShadow: "21px 40px 50px rgba(76, 175, 80, 0.8)",
                          }}
                        >
                          <div className="modal-header border-b border-emerald-600">
                            <h5
                              className="modal-title text-emerald-600"
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
                            <div className="flex flex-col gap-4">
                              {post.comments.map((comment) => (
                                <div
                                  key={comment._id}
                                  className="card rounded-lg shadow-lg mb-4"
                                  style={{
                                    border: "1px solid #4CAF50",
                                    borderRadius: "0.5rem",
                                    boxShadow:
                                      "21px 40px 50px rgba(76, 175, 80, 0.8)",
                                  }}
                                >
                                  <div className="card-body p-4">
                                    <div className="flex items-center mb-3">
                                      <img
                                        src={comment.author.profilePic}
                                        alt=""
                                        className="h-12 w-12 rounded-full border border-emerald-600"
                                        style={{ objectFit: "cover" }}
                                      />
                                      <div className="ml-3 text-center">
                                        <h5 className="text-emerald-600 text-lg font-semibold mb-0">
                                          {comment.author.name}
                                        </h5>
                                        <small className="text-gray-500">
                                          @{comment.author.username}
                                        </small>
                                      </div>
                                    </div>
                                    <p className="mb-4 font-monospace text-center">
                                      {comment.content}
                                    </p>
                                    <div className="flex flex-col md:flex-row justify-between items-center">
                                      <button
                                        className="btn btn-transparent text-emerald-600 flex items-center justify-center w-full md:w-1/2 border border-transparent transition-colors duration-300 ease-in-out hover:border-emerald-600 mb-2 md:mb-0"
                                        onClick={() =>
                                          handleCommentLike(comment, post._id)
                                        }
                                      >
                                        {!comment.isCommentLiked ? (
                                          <i className="fas fa-thumbs-up me-2"></i>
                                        ) : (
                                          <i className="fa-solid fa-thumbs-down"></i>
                                        )}
                                        {comment.isCommentLiked
                                          ? "Unlike"
                                          : "Like"}
                                      </button>
                                      <span className="bg-emerald-600 text-white rounded-full px-3 py-1 text-sm font-semibold">
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
                              <button
                                type="submit"
                                className="btn btn-emerald-600 text-white"
                              >
                                Post Comment
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
              <p className="text-center text-emerald-600 text-lg font-semibold">
                No posts available.
              </p>
            )}
          </div>
        )}
      </>
    </>
  );
}
