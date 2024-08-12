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
    <div>
      <div className="mt-52 mx-72">
        <label
          for="exampleFormControlTextarea1"
          className="form-label text-emerald-900"
        >
          Cook Something Great...
        </label>
        <textarea
          className="form-control mb-3"
          id="exampleFormControlTextarea1"
          rows="10"
          value={postText}
          onChange={handlePostTextChange}
          placeholder="What's on your mind?"
        ></textarea>
        <input type="file" onChange={(e) => setPostPic(e.target.files[0])} />
        <button className="btn btn-success float-right" onClick={createPost}>
          Create Post
        </button>
      </div>
    </div>
  );
}
