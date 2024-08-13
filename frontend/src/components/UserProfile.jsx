import React, { useEffect, useState } from "react";
import profile from "../Images/profile.png";
import axios from "axios";
import ChatBox from "./Chatbox";
import { jwtDecode } from "jwt-decode";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function Profile(props) {
  const [user, setUser] = useState({ friends: [] });
  const [token, setToken] = useState();
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestRecieved, setRequestRecieved] = useState(false);
  const [openDM, setOpenDM] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      if (
        props.user &&
        decodedToken &&
        decodedToken?.user?.requestsSent?.some(
          (friend) => friend._id === props.user._id
        )
      ) {
        setRequestSent(true);
      }

      if (
        props.user &&
        decodedToken &&
        decodedToken?.user?.requestsRecieved?.some(
          (friend) => friend._id === props.user._id
        )
      ) {
        setRequestRecieved(true);
      }
    }
  });

  const addFriend = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3002/send-friend-request",
        {
          toId: user._id,
          fromId: token.user._id,
        }
      );
      if (response.status === 200) {
        alert("Friend Request Sent Successfully");
        setToken(response.data.token);
        setRequestSent(true);
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

  const handleAccept = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3002/accept-friend-request",
        {
          fromId: user._id,
          toId: token.user._id,
        }
      );
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

  const handleReject = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3002/reject-friend-request",
        {
          fromId: user._id,
          toId: token.user._id,
        }
      );
      if (response.status === 200) {
        alert("Friend Request Rejected Successfully");
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

  const handleConfirmUnfriend = () => {
    removeFriend();
    setShowConfirmModal(false);
  };

  return (
    <div className="relative overflow-hidden bg-emerald-100">
      {openDM ? (
        <ChatBox fromId={token.user._id} toId={user._id} />
      ) : (
        <div
          className="container m-20 p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
          style={{ width: "87%" }}
        >
          <div className="container rounded bg-white mb-4">
            <div className="row">
              <div className="col-md-7 border-right">
                <div className="d-flex flex-column align-items-center text-center p-5">
                  <img
                    className="rounded-circle mt-5 transition-transform transform hover:scale-110 duration-300 ease-in-out"
                    width="150px"
                    height="150px"
                    src={user.profilePic || profile}
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="col-md-5 border-right">
                <div className="p-3 py-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-right fw-bold fs-4 transition-transform transform hover:translate-x-2 duration-300 ease-in-out">
                      User Profile
                    </h4>
                  </div>
                  <div className="row mt-1">
                    <div className="col-md-12">
                      <label className="labels fw-bold fs-5">Name</label>
                      <p className="fs-5">{user?.name}</p>
                    </div>
                    <div className="col-md-12">
                      <label className="labels fw-bold fs-5">Username</label>
                      <p className="fs-5">{user?.username}</p>
                    </div>
                  </div>
                  <div className="row mt-1">
                    <div className="col-md-12">
                      <label className="labels fw-bold fs-5">Email ID</label>
                      <p className="fs-5">{user?.email}</p>
                    </div>
                    <div className="col-md-12">
                      <label className="labels fw-bold fs-5">
                        Mobile Number
                      </label>
                      <p className="fs-5">{user?.contact}</p>
                    </div>
                  </div>
                  {token && token?.user?._id !== user?._id && (
                    <div className="d-flex flex-row justify-content-evenly w-75 my-3 pt-3">
                      {isFriend ? (
                        <>
                          <button
                            className="btn btn-primary transition-opacity duration-300 ease-in-out hover:opacity-100"
                            style={{ opacity: 0.7 }}
                            onClick={() => setShowConfirmModal(true)}
                          >
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                            Friends
                          </button>
                          <button
                            className="btn btn-success transition-transform duration-300 ease-in-out hover:scale-105"
                            onClick={() => setOpenDM(true)}
                          >
                            Message
                          </button>
                        </>
                      ) : requestSent ? (
                        <button className="btn btn-primary" disabled>
                          Request Sent!
                        </button>
                      ) : requestRecieved ? (
                        <div className="mt-3">
                          <p>{user.name} sent you a friend request!</p>
                          <div className="flex space-x-2">
                            <button
                              className="btn btn-success transition-transform duration-300 ease-in-out hover:scale-105"
                              onClick={handleAccept}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger transition-transform duration-300 ease-in-out hover:scale-105"
                              onClick={handleReject}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary transition-transform duration-300 ease-in-out hover:scale-105"
                          onClick={addFriend}
                        >
                          Add Friend
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Unfriend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove {user.name} from your friends?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmUnfriend}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
