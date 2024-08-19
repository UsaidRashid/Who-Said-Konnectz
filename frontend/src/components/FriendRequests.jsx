import axios from "axios";
import React, { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { jwtDecode } from "jwt-decode";
const api = import.meta.env.VITE_BACKEND_URL;

export default function FriendRequests() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  let _id = null;
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    _id = decodedToken.user._id;
  }

  useEffect(() => {
    const main = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    main();
  }, []);

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
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-6"
              style={{ animation: "glow 1.5s infinite alternate" }}
            >
              Fetching Your Friend Requests...
              <p className="text-sm sm:text-base md:text-lg lg:text-xl my-2">
                Lol Do You Really Think?
              </p>
            </div>
            <div className="relative flex justify-center items-center mt-5">
              <div
                className="absolute w-16 h-16 sm:w-24 sm:h-24 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"
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
        <div className="bg-emerald-100 min-h-screen my-32 py-6 px-4 sm:px-6 lg:px-8 mx-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-emerald-800 mb-4 sm:mb-6">
            All Friend Requests
          </h1>
          <div className="flex flex-col gap-6">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  onMouseEnter={() => setHoveredCard(user._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setUser(user)}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="h-16 w-16 rounded-full border-2 border-emerald-500 object-cover"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-emerald-700">
                        {user.name}
                      </h2>
                      <p className="text-gray-500 text-sm">@{user.username}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                      <button
                        className="btn btn-success text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500 py-2 px-4 rounded"
                        onClick={() => handleAccept(user._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger text-white bg-red-500 hover:bg-red-600 focus:ring-red-500 py-2 px-4 rounded"
                        onClick={() => handleReject(user._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No users found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
