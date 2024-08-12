import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "../store/Features/postSlice";
import { toggleLike, toggleLikeComment } from "../store/Features/postSlice";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        const response = await axios.get("http://localhost:3002/posts/fetch");

        console.log("response", response.data.posts);
        dispatch(
          setPosts(
            response.data.posts.map((post) => ({
              ...post,
              isLiked: post.likes.includes(userId),
              _id: post._id,
              content: post.content,
              author: post.author.name,
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
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

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
      console.log(commentId);
      if (response.status === 200) {
        dispatch(toggleLikeComment({ commentId, userId, postId }));
      } else {
        console.error("Error liking Comment:", response.data.message);
      }
    } catch (error) {
      console.log("Error occured while liking", error);
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
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    try {
      const content = e.target.elements[`commentText-${postId}`].value;
      console.log(content);
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
      console.error("Error commenting on post:", error);
    }
  };
  return (
    <div className="container my-48">
      {posts && posts.length > 0 ? (
        <div className="d-flex flex-column gap-4 mx-60">
          {posts.map((post) => (
            <div
              key={post._id}
              className="card border-emerald-600 shadow-lg mb-4"
              style={{
                border: "1px solid #4CAF50",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div className="card-body">
                <div className="d-flex flex-row justify-content-evenly w-25">
                  <img
                    src={post.profilePic}
                    alt=""
                    height="40px"
                    width="40px"
                    className="rounded-circle"
                  />
                  <h5 className="card-title text-emerald-600 mt-2">
                    {post.author}
                  </h5>
                </div>
                <p className="card-text mb-4">{post.content}</p>
                <div className="mb-3 text-center">
                  <span className="badge bg-light text-dark me-2">
                    {post.likes.length} Likes
                  </span>
                  <span className="badge bg-light text-dark">
                    {post.comments.length} Comments
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    className={`btn btn-${post.isLiked ? "danger" : "success"}`}
                    onClick={() => handleLike(post)}
                  >
                    {post.isLiked ? "Unlike" : "Like"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#commentsModal-${post._id}`}
                  >
                    Comments
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
                              <div className="d-flex flex-row justify-content-evenly w-25">
                                <img
                                  src={comment.author.profilePic}
                                  alt=""
                                  height="40px"
                                  width="40px"
                                  className="rounded-circle"
                                />
                                <h5 className="card-title text-emerald-600 mt-2">
                                  {comment.author.name}
                                </h5>
                              </div>
                              <p className="card-text mb-4">
                                {comment.content}
                              </p>
                              <div className="mb-3 text-center">
                                <span className="badge bg-light text-dark me-2">
                                  {comment.likes.length} Likes
                                </span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <button
                                  className={`btn btn-${
                                    comment.isCommentLiked
                                      ? "danger"
                                      : "success"
                                  } btn-sm`}
                                  onClick={() =>
                                    handleCommentLike(comment, post._id)
                                  }
                                >
                                  {comment.isCommentLiked ? "Unlike" : "Like"}
                                </button>
                                {/* Add reply button if needed */}
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
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
