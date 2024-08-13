import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import '../styles/updateProfile.css'

export default function ProfileUpdate() {
  const token = localStorage.getItem("token");
  let decodedToken = null;

  if (token) {
    decodedToken = jwtDecode(token);
  } else {
    alert("Seems like you are not logged in...");
    navigate("/login");
  }

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: decodedToken.user.name ? decodedToken.user.name : "",
    email: decodedToken.user.email ? decodedToken.user.email : "",
    contact: decodedToken.user.contact ? decodedToken.user.contact : "",
    profilePic: "",
    token: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "profilePic") {
      setFormData({
        ...formData,
        profilePic: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      formData.token = token;
      console.log(formData);
      const response = await axios.post(
        "http://localhost:3002/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        const token = response.data.token;
        localStorage.removeItem("token");
        localStorage.setItem("token", token);
        navigate("/");
      } else {
        alert("Error Updating:", response.data.message);
      }
    } catch (error) {
      console.error("Error in Updating:", error);
      alert(`${error.name} -> ${error.message}`);
      if (error.response) {
        alert("Error from server: " + error.response.data.message);
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  return (
    <div className="profile-update-container mt-10">
      <div className="form-container">
        <h3 className="text-center text-dark font-weight-bold fs-4 mb-4">
          Update your profile!
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="text-dark font-weight-bold fs-5">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label className="text-dark font-weight-bold fs-5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label className="text-dark font-weight-bold fs-5">
              Contact No
            </label>
            <input
              type="number"
              name="contact"
              className="form-control"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mb-3">
            <label className="text-dark font-weight-bold fs-5">
              Profile Picture
            </label>
            <input
              type="file"
              name="profilePic"
              className="form-control"
              onChange={handleChange}
            />
          </div>
          <button
            className="btn btn-primary fs-5"
            type="submit"
          >
            <b>Update</b>
          </button>
        </form>
      </div>
    </div>
  );
}
