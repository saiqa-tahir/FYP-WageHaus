// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Community.css';

// const Community = () => {
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [newPost, setNewPost] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch all groups from the backend
// // Fetch all groups with membership status
// const fetchGroups = async () => {
//   setLoading(true);
//   try {
//     const userEmail = localStorage.getItem('userEmail');
//     console.log('Fetching groups for user:', userEmail);
//     const response = await axios.get(`http://localhost:5000/api/community/groups?userEmail=${userEmail}`);
//     setGroups(response.data);
//   } catch (error) {
//     setError('Failed to fetch groups.');
//   } finally {
//     setLoading(false);
//   }
// };

//   // Fetch posts for a specific group
//   const fetchGroupPosts = async (groupId) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/community/group-posts/${groupId}`);
//       setPosts(response.data);
//     } catch (error) {
//       console.error('Error fetching group posts:', error);
//     }
//   };

//   // Join a group
//   const handleJoinGroup = async (groupId) => {
//     const userEmail = localStorage.getItem('userEmail');
//     if (!userEmail) {
//       alert('Please log in to join a group.');
//       return;
//     }

//     try {
//       await axios.post(`http://localhost:5000/api/community/join-group/${groupId}`, { userEmail });
//       fetchGroups(); // Refresh groups list
//     } catch (error) {
//       console.error('Error joining group:', error);
//     }
//   };

//   // Leave a group
//   const handleLeaveGroup = async (groupId) => {
//     const userEmail = localStorage.getItem('userEmail'); // Use userEmail instead of userId
//     if (!userEmail) {
//       alert('Please log in to leave a group.');
//       return;
//     }

//     try {
//       await axios.post(`http://localhost:5000/api/community/leave-group/${groupId}`, { userEmail });
//       fetchGroups(); // Refresh groups list
//     } catch (error) {
//       console.error('Error leaving group:', error);
//     }
//   };

//   // Add a post to a group
//   const handleAddPost = async (groupId) => {
//     const userEmail = localStorage.getItem('userEmail'); // Use userEmail instead of userId
//     if (!userEmail) {
//       alert('Please log in to add a post.');
//       return;
//     }

//     try {
//       await axios.post(`http://localhost:5000/api/community/add-post/${groupId}`, {
//         userEmail,
//         content: newPost,
//       });
//       setNewPost(''); // Clear input
//       fetchGroupPosts(groupId); // Refresh posts
//     } catch (error) {
//       console.error('Error adding post:', error);
//     }
//   };

//   // Handle group selection
//   const handleGroupClick = (groupId) => {
//     setSelectedGroup(groupId);
//     fetchGroupPosts(groupId);
//   };

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   return (
//     <div className="community-container">
//       <h1>Community Groups</h1>
//       {loading && <p>Loading...</p>}
//       {error && <p className="error">{error}</p>}
//       <div className="groups-grid">
//   {groups.map((group) => (
//     <div key={group._id} className="group-card">
//       <h2 onClick={() => handleGroupClick(group._id)}>{group.name}</h2>
//       <p>{group.description}</p>
//       <p>Members: {(group.members || []).length}/{group.membersLimit}</p>
//       {group.isMember ? (
//         <button className="leave-button" onClick={() => handleLeaveGroup(group._id)}>
//           Leave Group
//         </button>
//       ) : (
//         <button className="join-button" onClick={() => handleJoinGroup(group._id)}>
//           Join Group
//         </button>
//       )}

//     </div>
//   ))}
// </div>

//       {/* Group Discussions */}
//       {selectedGroup && (
//         <div className="discussion-container">
//           <h2>Discussion</h2>
//           <div className="posts-container">
//             {posts.map((post) => (
//               <div key={post._id} className="post">
//                 <p><strong>{post.userEmail}:</strong> {post.content}</p>
//               </div>
//             ))}
//           </div>  
//           <div className="add-post">
//             <textarea
//               placeholder="Type your message..."
//               value={newPost}
//               onChange={(e) => setNewPost(e.target.value)}
//             />
//             <button onClick={() => handleAddPost(selectedGroup)}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Community;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Community.css';
import SeekerNavbar from './SeekerNavbar';
const Community = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch all groups with membership status
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const userEmail = localStorage.getItem('userEmail');
      console.log('Fetching groups for user:', userEmail);
      const response = await axios.get(`http://localhost:5000/api/community/groups?userEmail=${userEmail}`);
      setGroups(response.data);
    } catch (error) {
      setError('Failed to fetch groups.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts for a specific group
  const fetchGroupPosts = async (groupId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/community/group-posts/${groupId}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching group posts:', error);
    }
  };

  // Join a group
  const handleJoinGroup = async (groupId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please log in to join a group.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/community/join-group/${groupId}`, { userEmail });
      fetchGroups(); // Refresh groups list
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  // Leave a group
  const handleLeaveGroup = async (groupId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please log in to leave a group.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/community/leave-group/${groupId}`, { userEmail });
      fetchGroups(); // Refresh groups list
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  // Add a post to a group
  const handleAddPost = async (groupId) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please log in to add a post.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/community/add-post/${groupId}`, {
        userEmail,
        content: newPost,
      });
      setNewPost(''); // Clear input
      fetchGroupPosts(groupId); // Refresh posts
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  // Handle group selection
  const handleGroupClick = (groupId) => {
    setSelectedGroup(groupId);
    fetchGroupPosts(groupId);
  };

  // Redirect to Discussion page
  const handleOpenToChat = (groupId) => {
    navigate(`/chat/${groupId}`); // Redirect to ChatRoom page with groupId
  };
  
  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className='bg-gray-100'>
    <div className="community-container">
      <h1 className='text-4xl font-bold underline'>Community Groups</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="groups-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {groups.map((group) => (
    <div key={group._id} className="group-card flex flex-col border border-gray-200 rounded-lg shadow-sm p-4 bg-white">
      <h2
        className="text-xl font-semibold mb-2 cursor-pointer hover:text-blue-600"
        onClick={() => handleGroupClick(group._id)}
      >
        {group.name}
      </h2>
      <p className="text-gray-600 mb-4">{group.description}</p>
      <p className="text-gray-500 mb-4">
        Members: {(group.members || []).length}/{group.membersLimit}
      </p>

      {/* Buttons container */}
      <div className="mt-auto space-y-2">
        {group.isMember ? (
          <>
            <button
              className="w-full bg-cyan-700 text-white py-2 px-4 rounded-lg  transition-colors"
              onClick={() => handleLeaveGroup(group._id)}
            >
              Leave Group
            </button>
            <button
              className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
              onClick={() => handleOpenToChat(group._id)}
            >
              Open to Chat
            </button>
          </>
        ) : (
          <button
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => handleJoinGroup(group._id)}
          >
            Join Group
          </button>
        )}
      </div>
    </div>
  ))}
</div>

      {/* Group Discussions */}
      {selectedGroup && (
        <div className="discussion-container">
          <h2>Discussion</h2>
          <div className="posts-container">
            {posts.map((post) => (
              <div key={post._id} className="post">
                <p><strong>{post.userEmail}:</strong> {post.content}</p>
              </div>
            ))}
          </div>
          <div className="add-post">
            <textarea
              placeholder="Type your message..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <button onClick={() => handleAddPost(selectedGroup)}>Send</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Community;