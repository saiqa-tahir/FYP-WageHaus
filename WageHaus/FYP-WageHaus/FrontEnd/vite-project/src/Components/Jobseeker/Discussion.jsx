import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import './Discussion.css';

const Discussion = () => {
  const { groupId } = useParams(); // Get groupId from the URL
  const [posts, setPosts] = useState([]); // For fetched posts
  const [messages, setMessages] = useState([]); // For real-time chat messages
  const [newMessage, setNewMessage] = useState(''); // For new message input
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(''); // For error handling
  const socketRef = useRef(null); // For WebSocket connection

  // Fetch posts for the selected group
  const fetchGroupPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/community/group-posts/${groupId}`);
      setPosts(response.data);
    } catch (error) {
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  // Set up WebSocket connection and event listeners
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

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchGroupPosts();
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
    <div className="discussion-container">
      <h1>Group Discussion</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Display fetched posts */}
      <div className="posts-container">
        <h2>Posts</h2>
        {posts.map((post) => (
          <div key={post._id} className="post">
            <p><strong>{post.userEmail}:</strong> {post.content}</p>
          </div>
        ))}
      </div>

      {/* Display real-time chat messages */}
      <div className="messages-container">
        <h2>Chat</h2>
        {messages.map((msg) => (
          <div key={msg._id} className="message">
            <p><strong>{msg.userEmail}:</strong> {msg.message}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      {/* Input for new chat messages */}
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

export default Discussion;