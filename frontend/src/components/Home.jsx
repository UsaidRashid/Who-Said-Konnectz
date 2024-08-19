import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "../store/Features/postSlice";
import { toggleLike, toggleLikeComment } from "../store/Features/postSlice";
import { jwtDecode } from "jwt-decode";
const api = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const posts = useSelector((state) => state.post.posts);
  const storedToken = localStorage.getItem("token");

  let userId = null;
  if (storedToken) {
    const decodedToken = jwtDecode(storedToken);

    if (!decodedToken.user._id) {
      alert("Token doesnt have userId");
      return;
    }
    userId = decodedToken.user._id;
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${api}posts/fetch?page=${page}&limit=10`
        );
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
              createdAt: post.createdAt,
              comments: post.comments.map((comment) => ({
                ...comment,
                isCommentLiked: comment.likes.includes(userId),
              })),
            })),
            home: true,
          })
        );

        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error("Error in fetching posts :", error);
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

    fetchPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const bottomPosition = document.documentElement.offsetHeight;
      const buffer = 50;

      if (scrollPosition + buffer >= bottomPosition) {
        if (!loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

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
      console.error("Error in liking:", error);
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
      console.error("Error in liking post:", error);
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
      console.error("Error in Commenting:", error);
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  return (
    <>
      <div className="container my-12 mx-auto px-4">
        {posts && posts.length > 0 ? (
          <div className="flex flex-col gap-4 my-32">
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
                      <small className="text-gray-500">@{post.username}</small>{" "}
                      <br />
                      <small className="text-gray-500">
                        Posted At : {formatDate(post.createdAt)}
                      </small>
                    </div>
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
                  style={{
                    animation: "slide-up 0.5s ease-out",
                  }}
                >
                  <div
                    className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                    style={{
                      margin: "0 auto",
                    }}
                  >
                    <div
                      className="modal-content"
                      style={{
                        border: "1px solid #4CAF50",
                        borderRadius: "0.5rem",
                        boxShadow: "21px 40px 50px rgba(76, 175, 80, 0.8)",
                        transform: "translateY(0)",
                        transition: "transform 0.3s ease, opacity 0.3s ease",
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
                                minWidth: "300px",
                                maxWidth: "600px",
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
                                  <div className="ml-3">
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
                                <div className="flex justify-between items-center">
                                  <button
                                    className="btn btn-transparent text-emerald-600 flex items-center justify-center w-1/2 border border-transparent transition-colors duration-300 ease-in-out hover:border-emerald-600"
                                    onClick={() =>
                                      handleCommentLike(comment, post._id)
                                    }
                                  >
                                    {!comment.isCommentLiked ? (
                                      <i className="fas fa-thumbs-up me-2"></i>
                                    ) : (
                                      <i className="fa-solid fa-thumbs-down"></i>
                                    )}
                                    {comment.isCommentLiked ? "Unlike" : "Like"}
                                  </button>
                                  <span
                                    className="bg-emerald-600 text-white rounded-full px-3 py-1 text-sm font-semibold"
                                    style={{ display: "inline-block" }}
                                  >
                                    {comment.likes.length} Likes
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={(e) => handleAddComment(e, post._id)}>
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
                <style>{`
                    @keyframes slide-up {
                      from {
                        transform: translateY(100%);
                        opacity: 0;
                      }
                      to {
                        transform: translateY(0);
                        opacity: 1;
                      }
                    }
                    .modal.fade.show {
                      animation: slide-up 0.5s ease-out;
                    }
                  `}</style>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
        {loading && (
          <div className="flex items-center justify-center py-8">
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
        )}
      </div>
    </>
  );
}
