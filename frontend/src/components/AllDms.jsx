import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ChatBox from "./Chatbox";
import { FaArrowRight } from "react-icons/fa";

export default function AllDms() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [token, setToken] = useState();

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
        const response = await axios.post(
          "http://localhost:3002/fetch-friends",
          { _id }
        );
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
      }
    };
    if (storedToken) main();
  }, []);

  return (
    <div className="my-32 mx-32">
      {user ? (
        <ChatBox fromId={token.user._id} toId={user._id} />
      ) : (
        <div className="p-6 bg-emerald-100 min-h-screen">
          <h1 className="text-2xl font-bold text-emerald-700 mb-4 text-center">
            All Chats
          </h1>
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-emerald-50 transition duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredCard(user._id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setUser(user)}
                style={{ position: "relative" }}
              >
                <div className="d-flex flex-row">
                  <img
                    src={user.profilePic}
                    height="40px"
                    width="40px"
                    className="h-16 w-16 rounded-full border-2 border-emerald-500 object-cover"
                  />
                  <span className="text-emerald-900 font-semibold mt-1 ms-1">
                    {user.name}
                  </span>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor:
                        hoveredCard === user._id
                          ? "rgba(255, 255, 255, 0.5)"
                          : "transparent",
                      backdropFilter:
                        hoveredCard === user._id ? "blur(10px)" : "none",
                      zIndex: 10,
                      transition:
                        "background-color 0.3s ease, backdrop-filter 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: "1rem",
                        height: "100%",
                      }}
                    >
                      {hoveredCard === user._id && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              color: "#4a5568",
                              marginBottom: "0.5rem",
                            }}
                          >
                            Message
                          </p>
                          <FaArrowRight
                            style={{
                              fontSize: "2rem",
                              color: "#4a5568",
                              transition: "transform 0.3s ease",
                              transform: "translateX(0)",
                              ":hover": {
                                transform: "translateX(5px)",
                              },
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
