import axios from "axios";
import React, { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { jwtDecode } from "jwt-decode";
const api = import.meta.env.VITE_BACKEND_URL;

export default function FriendRequests() {
  const [users, setUsers] = useState([]);

  let _id = null;
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    _id = decodedToken.user._id;
  }

  useEffect(() => {
    const main = async () => {
      try {
        const response = await axios.post(api + "fetch-friend-requests", {
          _id,
        });
        if (response.status === 200) {
          setUsers(response.data.requests);
        } else {
          alert(response.data.message || "Some Error occured");
        }
      } catch (error) {
        console.error("Error in fetching friend requests:", error);
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
    main();
  });

  const handleAccept = async (fromId) => {
    try {
      const response = await axios.post(api + "accept-friend-request", {
        fromId,
        toId: _id,
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

  const handleReject = async (fromId) => {
    try {
      const response = await axios.post(api + "reject-friend-request", {
        fromId,
        toId: _id,
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

  return (
    <div className="mx-32 my-32">
      <>
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
          All Friend Requests
        </h1>
        <div className="flex flex-col space-y-6 p-6 bg-emerald-100 min-h-screen">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex-1">
                  <div className="d-flex flex-row">
                    <img
                      src={user.profilePic}
                      height="40px"
                      width="40px"
                      className="rounded-circle"
                    />
                    <div className="mx-5">
                      <h2 className="text-xl font-semibold text-emerald-700">
                        {user.name}
                      </h2>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-gray-500 text-sm">{user.username}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="btn btn-success"
                    onClick={() => handleAccept(user._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(user._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No Requests found.</p>
          )}
        </div>
      </>
    </div>
  );
}
