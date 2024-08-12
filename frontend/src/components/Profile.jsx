import React from "react";
import profile from "../Images/profile.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
// import "../styles/profile.css"; 

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let decodedToken = null;

  if (token) {
    decodedToken = jwtDecode(token);
  } else {
    alert("Seems like you are not logged in...");
    navigate("/login");
  }

  return (
    <div className="relative overflow-hidden bg-emerald-100">
      <div className="container w-75 my-48 p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
        <div className="container rounded bg-white mb-4">
          <div className="row">
            <div className="col-md-7 border-right">
              <div className="d-flex flex-column align-items-center text-center p-5 py-5">
                <img
                  className="rounded-circle mt-5 transition-transform transform hover:scale-110 duration-300 ease-in-out"
                  width="150px"
                  height="150px"
                  src={decodedToken.user.profilePic || profile}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="col-md-5 border-right">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right fw-bold fs-4 transition-transform transform hover:translate-x-2 duration-300 ease-in-out">Your Profile</h4>
                </div>
                <div className="row mt-1">
                  <div className="col-md-12">
                    <label className="labels fw-bold fs-5">Name</label>
                    <p className="fs-5">{decodedToken.user?.name}</p>
                  </div>
                  <div className="col-md-12">
                    <label className="labels fw-bold fs-5">Username</label>
                    <p className="fs-5">{decodedToken.user?.username}</p>
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col-md-12">
                    <label className="labels fw-bold fs-5">Email ID</label>
                    <p className="fs-5">{decodedToken.user?.email}</p>
                  </div>
                  <div className="col-md-12">
                    <label className="labels fw-bold fs-5">Mobile Number</label>
                    <p className="fs-5">{decodedToken.user?.contact}</p>
                  </div>
                </div>
                <button
                  className="mt-3 btn btn-outline-success transition-colors duration-300 ease-in-out hover:bg-emerald-500 hover:text-white"
                  onClick={() => navigate('/profile-update')}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
