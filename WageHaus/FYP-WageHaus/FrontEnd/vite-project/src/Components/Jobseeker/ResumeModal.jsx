import React from 'react';

const ResumeModal = () => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-bold">Create Resume</h2>
        <form>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded mt-2"
          />
          <input
            type="text"
            placeholder="Email"
            className="w-full p-2 border rounded mt-2"
          />
          {/* Add other inputs */}
          <button className="bg-blue-500 text-white p-2 rounded mt-4">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeModal;
