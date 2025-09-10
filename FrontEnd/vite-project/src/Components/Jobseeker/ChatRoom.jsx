import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Discussion.css';

const ChatRoom = () => {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = io('http://localhost:5000');

    // Join the group room
    socketRef.current.emit('joinGroup', groupId);

    // Listen for previous messages
    socketRef.current.on('previousMessages', (messages) => {
      setMessages(messages);
    });

    // Listen for new messages
    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [groupId]);

  // Send a new message
  const handleSendMessage = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (newMessage.trim() && userEmail) {
      const message = {
        groupId,
        userEmail,
        message: newMessage,
      };

      // Emit the message to the server
      socketRef.current.emit('sendMessage', message);

      // Clear the input
      setNewMessage('');
    }
  };

  return (
    <div className="chat-room-container">
      <h1>Chat Room</h1>
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg._id} className="message">
            <p><strong>{msg.userEmail}:</strong> {msg.message}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="message-input">
        <textarea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;