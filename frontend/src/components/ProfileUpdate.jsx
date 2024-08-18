import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const api = import.meta.env.VITE_BACKEND_URL;

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
      const response = await axios.post(api + "update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    <div className="container mt-32">
      <div
        className="bg-white rounded-lg shadow-lg p-4 mx-auto"
        style={{
          maxWidth: "600px",
          minHeight: "100vh",
          backgroundColor: "#d4edda",
        }}
      >
        <h3 className="text-center text-emerald-900 font-weight-bold mb-4 text-4xl">
          Update your profile!
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-dark fw-bold fs-5">Name</label>
            <input
              type="text"
              name="name"
              className="form-control border border-gray-300 rounded px-3 py-2"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-dark fw-bold fs-5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control border border-gray-300 rounded px-3 py-2"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-dark fw-bold fs-5">
              Contact No
            </label>
            <input
              type="number"
              name="contact"
              className="form-control border border-gray-300 rounded px-3 py-2"
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Upload a cheesy Profile Picture!
              <input
                id="file-upload"
                type="file"
                className="hidden"
                name="profilePic"
                onChange={handleChange}
              />
            </label>
          </div>
          <button className="btn btn-primary fs-5" type="submit">
            <b>Update</b>
          </button>
        </form>
      </div>
    </div>
  );
}
