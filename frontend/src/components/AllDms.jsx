import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ChatBox from "./Chatbox";

export default function AllDms() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
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
        console.error("Error in Logging in:", error);
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
    <>
      {user ? (
        <ChatBox fromId={token.user._id} toId={user._id} />
      ) : (
        <div className="p-6 bg-emerald-100 min-h-screen my-48">
          <h1 className="text-2xl font-bold text-emerald-700 mb-4">
            All Chats
          </h1>
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-emerald-50 transition duration-200 cursor-pointer"
                onClick={() => setUser(user)}
              >
                <span className="text-emerald-900 font-semibold">
                  {user.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
