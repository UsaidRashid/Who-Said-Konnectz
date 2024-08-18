import axios from "axios";
import React, { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
const api = import.meta.env.VITE_BACKEND_URL;

export default function Friends() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let _id = null;
    if (!token || token === "") {
      alert("You must be logged in...");
      navigate("/login");
    } else {
      const decodedToken = jwtDecode(token);
      _id = decodedToken.user._id;
    }
    const main = async () => {
      try {
        setLoading(true);
        const response = await axios.post(api + "fetch-friends", { _id });
        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          alert(response.data.message || "Some Error occured");
        }
      } catch (error) {
        console.error("Error in fetching friends:", error);
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
    if (token) main();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div
              className="text-2xl font-bold text-emerald-600 mb-16"
              style={{ animation: "glow 1.5s infinite alternate" }}
            >
              Fetching Your Friends...
              <p>Lol Do You Really have?</p>
            </div>
            <div className="relative flex justify-center items-center">
              <div
                className="absolute w-24 h-24 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"
                style={{ animationDuration: "1s" }}
              ></div>
            </div>
          </div>

          {/* Inline style for animations */}
          <style jsx>{`
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
        <div className="container mx-auto my-32 px-4">
          {user ? (
            <UserProfile user={user} />
          ) : (
            <div className="bg-emerald-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
                All Friends
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
                      <div className="flex items-center gap-4">
                        <img
                          src={user.profilePic}
                          alt={user.name}
                          className="h-16 w-16 rounded-full border-2 border-emerald-500 object-cover"
                        />
                        <div>
                          <h2 className="text-xl font-semibold text-emerald-700">
                            {user.name}
                          </h2>

                          <p className="text-gray-500 text-sm">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                          hoveredCard === user._id
                            ? "bg-white bg-opacity-50 backdrop-blur-sm"
                            : "bg-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-end h-full pr-4">
                          {hoveredCard === user._id && (
                            <div className="flex flex-col items-center text-center">
                              <p className="text-lg font-bold text-gray-700 mb-2">
                                See Full Profile
                              </p>
                              <FaArrowRight
                                className={`text-2xl text-gray-700 transition-transform duration-300 ease-in-out ${
                                  hoveredCard === user._id
                                    ? "translate-x-1"
                                    : "translate-x-0"
                                }`}
                              />
                            </div>
                          )}
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
        </div>
      )}
    </>
  );
}
