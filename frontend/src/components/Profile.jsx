import React from "react";
import profile from "../Images/profile.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


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
    <div className="container w-75  my-48  p-6 bg-emerald-100 rounded-lg shadow-lg">
      <div
        class="container rounded bg-white mb-4"
        style={{
          boxShadow: "9px 9px 14px rgb(0 ,0, 0, .371)",
          border: "1px solid black",
        }}
      >
        <div class="row">
          <div class=" col-md-7 border-right">
            <div class="d-flex flex-column align-items-center text-center p-5 py-5">
              <img
                class="rounded-circle mt-5"
                width="150px"
                height="150px"
                src={profile}
              />
            </div>
          </div>
          <div class="col-md-5 border-right">
            <div class="p-3 py-5">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="text-right fw-bold fs-4">Your Profile</h4>
              </div>
              <div class="row mt-1">
                <div class="col-md-12">
                  <label class="labels fw-bold fs-5"> Name</label>
                  <p class="fs-5">{decodedToken.user?.name}</p>
                </div>
                <div class="col-md-12">
                  <label class="labels fw-bold fs-5">User name</label>
                  <p class="fs-5">{decodedToken.user?.username}</p>
                </div>
              </div>
              <div class="row mt-1">
                <div class="col-md-12">
                  <label class="labels fw-bold fs-5">Email ID</label>
                  <p class="fs-5">{decodedToken.user?.email}</p>
                </div>
                <div class="col-md-12">
                  <label class="labels fw-bold fs-5">Mobile Number</label>
                  <p class="fs-5">{decodedToken.user?.contact}</p>
                </div>
                {/* <div className="d-flex flex-row justify-content-evenly"> */}
                    
                {/* </div> */}
              </div>
              <button className="mt-3 btn btn-outline-success" onClick={()=>navigate('/profile-update')}>
                      Update
                    </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
