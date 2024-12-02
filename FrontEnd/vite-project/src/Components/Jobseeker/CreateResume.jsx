import React, { useState } from 'react';
import axios from 'axios';

const CreateResume = ({ togglePopup }) => {
  // Define state for form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    linkedin: '',
    education: {
      institution: '',
      degree: '',
      graduationYear: '',
    },
    skills: '',
    experience: [
      {
    
        companyName: '',
        jobTitle: '',
        duration: '',
      },
    ],
    certifications: '',
    hobbies: '',
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      education: {
        ...prevData.education,
        [name]: value,
      },
    }));
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      experience: updatedExperience,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the backend API
      const response = await axios.post('http://localhost:5000/api/resumes/create', formData);
      console.log('Resume created successfully', response.data);
      togglePopup();  // Close the popup on success
    } catch (error) {;
      console.error('Error creating resume', error.response?.data || error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative bg-white p-8 rounded-lg w-full max-w-3xl shadow-lg overflow-auto max-h-[90vh]">
        <button onClick={togglePopup} className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Create Resume</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Contact Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Contact Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
              <div>
                <label className="block text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Your Full Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Your Phone Number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="LinkedIn Profile URL"
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Education</h3>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-600">School/University</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.education.institution}
                  onChange={handleEducationChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Institution Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.education.degree}
                  onChange={handleEducationChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="e.g., B.Sc. in Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Graduation Year</label>
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.education.graduationYear}
                  onChange={handleEducationChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="e.g., 2023"
                  required
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Skills</h3>
            <div className="mt-4">
              <label className="block text-sm text-gray-600">List Your Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2"
                rows="3"
                placeholder="e.g., JavaScript, React, Python, Team Management"
              ></textarea>
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Experience</h3>
            {formData.experience.map((exp, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-600">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={exp.companyName}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., ABC Tech Ltd."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={exp.jobTitle}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={exp.duration}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., Jan 2020 - Dec 2022"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Additional Sections */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Certifications</h3>
            <div className="mt-4">
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2"
                placeholder="e.g., AWS Certified Developer"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Hobbies</h3>
            <div className="mt-4">
              <textarea
                name="hobbies"
                value={formData.hobbies}
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2"
                rows="3"
                placeholder="e.g., Reading, Traveling"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Submit Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResume;
