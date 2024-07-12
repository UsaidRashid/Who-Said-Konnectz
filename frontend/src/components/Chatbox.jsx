import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';


const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);

  const socket = io('http://localhost:3002');  

  useEffect(() => {
    socket.on('receive-message', (message) => {
        console.log('recieve',message);
        setMessages((messages) => [...messages, message]);
    });
  }, [socket]); 
  
  const sendMessage =() => {
    if (message ) {
      socket.emit('send-message',{ message,room});
      console.log('Sent message:', message); 
      setMessage(''); 
    }
  };

  const joinRoom = () =>{
    if(room){
        socket.emit('join_room',room);
        console.log('room joined');
    }
  };

  return (
    <div>
     <div id="chat-box" className='mt-48'>
       <h2>Chat</h2>
       <div id="messages">
         
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      
      <button onClick={sendMessage}>Send</button>
    </div>
    <div id="chat-box" className=''>
       <h2>Room</h2>
       <div id="messages">
      </div>
      <input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Enter your room"
      />
      
      <button onClick={joinRoom}>Join</button>
    </div>
    {messages && messages.map((msg) => (
          <p key={msg}>{msg}</p>
        ))}
    </div>
  );
};

export default ChatBox;
