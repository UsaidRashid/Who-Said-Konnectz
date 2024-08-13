import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
const api = import.meta.env.VITE_BACKEND_URL;

const ChatBox = ({ fromId, toId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(api + `messages/fetch-messages`, {
          fromId,
          toId,
        });
        if (response.status === 200) {
          setMessages(response.data.messages);
        } else {
          alert(response.data.message || "Error Fetching Messages");
        }
      } catch (error) {
        console.error("Error in Fetching Messages:", error);
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

    fetchMessages();

    socketRef.current = io(api);

    socketRef.current.emit("register_user", fromId);

    socketRef.current.on("receive_dm", ({ fromId: senderId, message }) => {
      if (senderId === toId || senderId === fromId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { fromId: senderId, message },
        ]);
      }
    });

    return () => {
      socketRef.current.off("receive_dm");
      socketRef.current.disconnect();
    };
  }, [fromId, toId]);

  const sendMessage = () => {
    if (message) {
      socketRef.current.emit("send_dm", { fromId, toId, message });
      setMessage("");
    }
  };

  return (
    <div className="container mx-auto my-48 p-4 border border-emerald-500 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-emerald-600 mb-4">Chat</h2>

      <div className="mb-4">
        <div className="bg-emerald-100 p-4 rounded-lg h-64 overflow-y-scroll">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 mb-2 rounded-lg shadow-sm ${
                msg.fromId === fromId ? "bg-emerald-50" : "bg-emerald-200"
              }`}
            >
              <p
                className={`text-emerald-800 ${
                  msg.fromId === fromId ? "text-right" : "text-left"
                }`}
              >
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          className="form-control border-emerald-300 rounded-lg shadow-sm"
        />
        <button
          onClick={sendMessage}
          className="btn btn-emerald-600 text-white ms-2 bg-black"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
