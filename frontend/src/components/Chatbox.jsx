import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = io("http://localhost:3002");

  useEffect(() => {
    socket.on("receive-message", (message) => {
      console.log("receive", message);
      setMessages((messages) => [...messages, message]);
    });
  }, [socket]);

  const sendMessage = () => {
    if (message) {
      socket.emit("send-message", { message, room });
      console.log("Sent message:", message);
      setMessage("");
    }
  };

  const joinRoom = () => {
    if (room) {
      socket.emit("join_room", room);
      console.log("room joined");
    }
  };

  return (
    <div className="container mx-auto my-36 p-4 border border-emerald-500 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-emerald-600 mb-4">Chat</h2>

      <div className="mb-4">
        <div className="bg-emerald-100 p-4 rounded-lg h-64 overflow-y-scroll">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="bg-emerald-50 p-2 mb-2 rounded-lg shadow-sm"
            >
              <p className="text-emerald-800">{msg}</p>
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

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-emerald-600 mb-2">Room</h3>
        <div className="mb-2">
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter your room"
            className="form-control border-emerald-300  rounded-lg shadow-sm"
          />
          <button
            onClick={joinRoom}
            className="btn btn-emerald-600 bg-black text-white mt-2"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
