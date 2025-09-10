import React, { useState, useEffect } from 'react';

import ResumeModal from './ResumeModal';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserProfile('user-id-here'); // Replace with dynamic user ID
      setUser(data);
    };
    fetchUser();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="absolute top-16 right-0 bg-white shadow-md rounded-md p-4 w-64">
      <h3 className="font-bold">{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={openModal} className="bg-blue-500 text-white p-2 rounded-md mt-4">
        Resume
      </button>
      {isModalOpen && <ResumeModal />}
    </div>
  );
};

export default UserProfile;
