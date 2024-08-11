import React, { useEffect, useState } from "react";
import profile from "../Images/profile.png";
import axios from "axios";
import ChatBox from "./Chatbox";
import { jwtDecode } from "jwt-decode";

export default function Profile(props) {
  const [user, setUser] = useState({ friends: [] });
  const [token, setToken] = useState();
  const [isFriend, setIsFriend] = useState(false);
  const [openDM, setOpenDM] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setUser(props.user);
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setToken(decodedToken);
      if (
        props.user &&
        decodedToken &&
        decodedToken?.user?.friends?.some(
          (friend) => friend._id === props.user._id
        )
      ) {
        setIsFriend(true);
      }
    }
  });

  const addFriend = async () => {
    try {
      const response = await axios.post("http://localhost:3002/add-friend", {
        toId: user._id,
        fromId: token.user._id,
      });
      console.log(response.data);
      if (response.status === 200) {
        alert("Friend Added Successfully");
        setToken(response.data.token);
        setIsFriend(true);
        localStorage.setItem("token", response.data.token);
      } else {
        alert(response.data.message || "Error Adding Friend");
      }
    } catch (error) {
      console.error("Error Adding Friend:", error);
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

  const removeFriend = async (req, res) => {
    try {
      const response = await axios.post("http://localhost:3002/remove-friend", {
        toId: user._id,
        fromId: token.user._id,
      });
      if (response.status === 200) {
        alert("Friend Removed Successfully");
        setToken(response.data.token);
        setIsFriend(false);
        localStorage.setItem("token", response.data.token);
      } else {
        alert(response.data.message || "Error Adding Friend");
      }
    } catch (error) {
      console.error("Error Removing Friend:", error);
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
      {openDM ? (
        <ChatBox fromId={token.user._id} toId={user._id} />
      ) : (
        <div
          class="container rounded bg-white"
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
                  <h4 class="text-right fw-bold fs-4">User Profile</h4>
                </div>
                <div class="row mt-1">
                  <div class="col-md-12">
                    <label class="labels fw-bold fs-5"> Name</label>
                    <p class="fs-5">{user?.name}</p>
                  </div>
                  <div class="col-md-12">
                    <label class="labels fw-bold fs-5">User name</label>
                    <p class="fs-5">{user?.username}</p>
                  </div>
                </div>
                <div class="row mt-1">
                  <div class="col-md-12">
                    <label class="labels fw-bold fs-5">Email ID</label>
                    <p class="fs-5">{user?.email}</p>
                  </div>
                  <div class="col-md-12">
                    <label class="labels fw-bold fs-5">Mobile Number</label>
                    <p class="fs-5">{user?.contact}</p>
                  </div>
                </div>
                {token &&
                  token?.user?._id !== user?._id &&
                  (isFriend ? (
                    <div className="d-flex flex-row justify-content-around w-50 my-3 pt-3">
                      <button
                        className="btn btn-primary"
                        onClick={removeFriend}
                      >
                        Friends
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => setOpenDM(true)}
                      >
                        Message
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-primary" onClick={addFriend}>
                      Add Friend
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
