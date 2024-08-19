import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ChatBox from "./Chatbox";
import { FaArrowRight } from "react-icons/fa";
const api = import.meta.env.VITE_BACKEND_URL;

export default function AllDms() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    let _id = null;
    if (!storedToken || storedToken === "") {
      alert("You must be logged in...");
      navigate("/login");
    } else {
      const decodedToken = jwtDecode(storedToken);
      _id = decodedToken.user._id;
      setToken(decodedToken);
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
        console.error("Error in fetching messages:", error);
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
    if (storedToken) main();
  }, []);

  return (
    <div className="my-32 mx-4 sm:my-16 sm:mx-8 lg:my-32 lg:mx-32">
      {user ? (
        <ChatBox fromId={token.user._id} toId={user._id} />
      ) : (
        <>
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-emerald-600 mb-4 sm:text-3xl md:text-4xl lg:text-5xl"
                  style={{ animation: "glow 1.5s infinite alternate" }}
                >
                  Fetching Your Chats...
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-2">
                    Lol Do Anyone talk with you?
                  </p>
                </div>
                <div className="relative flex justify-center items-center mt-5">
                  <div
                    className="absolute w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-emerald-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
                  All Chats
                </h1>
                <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10">
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
                            className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-2 border-emerald-500 object-cover"
                          />
                          <div>
                            <h2 className="text-lg font-semibold text-emerald-700 sm:text-xl md:text-2xl lg:text-3xl">
                              {user.name}
                            </h2>
                            <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg">
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
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-700 mb-2">
                                  Message
                                </p>
                                <FaArrowRight
                                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 transition-transform duration-300 ease-in-out ${
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
                    <p className="text-gray-500 text-center text-sm sm:text-base md:text-lg lg:text-xl">
                      No users found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
