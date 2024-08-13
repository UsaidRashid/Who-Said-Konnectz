import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function NewPost({ postCreated }) {
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [postPic, setPostPic] = useState(null);

  async function createPost() {
    try {
      const content = postText;
      const storedToken = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("content", content);
      formData.append("postPic", postPic);
      formData.append("token", storedToken);

      const response = await axios.post(
        "http://localhost:3002/posts/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 401) {
        alert("You must be Logged in!");
        navigate("/");
      }

      if (response.status === 200) {
        alert(response.data.message);
        postCreated();
        navigate("/");
      } else {
        alert("Unexpected status code: " + response.status);
      }
    } catch (error) {
      console.error("Error in creating a new post:", error);
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
  }

  function handlePostTextChange(event) {
    setPostText(event.target.value);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 my-32">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full transform transition-all hover:scale-105 duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-6 text-emerald-900 animate-pulse text-center">
          Cook Something Great...
        </h2>
        <textarea
          className="form-control mb-4 p-4 rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          id="exampleFormControlTextarea1"
          rows="10"
          value={postText}
          onChange={handlePostTextChange}
          placeholder="What's on your mind?"
        ></textarea>
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Got some Picture to attach with post?
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => setPostPic(e.target.files[0])}
          />
        </label>
        <button
          className="btn btn-success mt-6 float-right transition-transform transform hover:scale-110 duration-300 ease-in-out"
          onClick={createPost}
        >
          Create Post
        </button>
      </div>
    </div>
  );
}
