import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const CreateResume = ({ togglePopup }) => {
  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    linkedin: '',
    education: { institution: '', degree: '', graduationYear: '' },
    skills: '',
    experience: [{ companyName: '', jobTitle: '', duration: '' }],
    certifications: '',
    hobbies: '',
  });

  // State for suggestions and active field
  const [suggestions, setSuggestions] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [cursorPositions, setCursorPositions] = useState({});

  // Get user email from localStorage
  const userEmail = localStorage.getItem('userEmail');

  // Add styles for suggestions
  const suggestionStyles = {
    suggestionBox: {
      position: 'absolute',
      backgroundColor: '#f5f5f5',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '4px 8px',
      marginTop: '2px',
      fontSize: '14px',
      color: '#666',
      cursor: 'pointer',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease'
    },
    suggestionText: {
      margin: 0,
      padding: '2px 0',
      '&:hover': {
        backgroundColor: '#e0e0e0'
      }
    }
  };

  // Add SuggestionBox component
  const SuggestionBox = ({ suggestion, onSelect }) => {
    if (!suggestion) return null;
    
    return (
      <div 
        style={suggestionStyles.suggestionBox}
        onClick={onSelect}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e0e0e0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
      >
        <p style={suggestionStyles.suggestionText}>{suggestion}</p>
      </div>
    );
  };

  // Debounced function to fetch predictions from backend
  const debouncedPredict = useCallback(
    debounce(async (suggestionKey, field, text, cursorPosition) => {
      if (!text) {
        setSuggestions(prev => ({ ...prev, [suggestionKey]: '' }));
        return;
      }

      try {
        // Get the text before cursor for prediction
        const textBeforeCursor = text.substring(0, cursorPosition);
        const lastWord = textBeforeCursor.split(/\s+/).pop() || '';

        console.log(`Sending request for field: ${field}, text: "${lastWord}"`);
        const response = await axios.post('http://localhost:8000/predict', { 
          field, 
          text: lastWord
        });
        
        const suggestion = response.data.suggestion;
        console.log(`Received suggestion: "${suggestion}"`);
        
        if (suggestion && suggestion.toLowerCase() !== lastWord.toLowerCase()) {
          setSuggestions(prev => ({
            ...prev,
            [suggestionKey]: suggestion
          }));
        } else {
          setSuggestions(prev => ({ ...prev, [suggestionKey]: '' }));
        }
      } catch (error) {
        console.error('Prediction error:', error);
        setSuggestions(prev => ({ ...prev, [suggestionKey]: '' }));
      }
    }, 200), // Reduced debounce time for faster suggestions
    []
  );

  // Handle input changes
  const handleInputChange = (e, fieldType = 'personal', index = null) => {
    const { name, value } = e.target;
    const cursorPosition = e.target.selectionStart;

    // Update cursor position
    setCursorPositions(prev => ({
      ...prev,
      [fieldType === 'experience' ? `experience_${index}_${name}` : 
       fieldType === 'education' ? `education_${name}` : name]: cursorPosition
    }));

    // Update form data
    if (fieldType === 'education') {
      setFormData(prev => ({
        ...prev,
        education: { ...prev.education, [name]: value },
      }));
    } else if (fieldType === 'experience' && index !== null) {
      const updatedExperience = [...formData.experience];
      updatedExperience[index] = { ...updatedExperience[index], [name]: value };
      setFormData(prev => ({ ...prev, experience: updatedExperience }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Get suggestions
    const suggestionKey = fieldType === 'experience' ? `experience_${index}_${name}` : 
                         fieldType === 'education' ? `education_${name}` : name;
    setActiveField(suggestionKey);
    debouncedPredict(suggestionKey, name, value, cursorPosition);
  };

  // Handle field focus
  const handleFocus = (fieldType = 'personal', index = null, name) => {
    const suggestionKey = fieldType === 'experience' ? `experience_${index}_${name}` : 
                         fieldType === 'education' ? `education_${name}` : name;
    setActiveField(suggestionKey);
    
    // Get current value and cursor position
    let value;
    if (fieldType === 'experience') {
      value = formData.experience[index][name];
    } else if (fieldType === 'education') {
      value = formData.education[name];
    } else {
      value = formData[name];
    }
    
    const cursorPosition = cursorPositions[suggestionKey] || (value ? value.length : 0);
    
    if (value) debouncedPredict(suggestionKey, name, value, cursorPosition);
  };

  // Handle field blur
  const handleBlur = () => {
    // Short delay to allow tab key acceptance to work before clearing active field
    setTimeout(() => {
      setActiveField(null);
    }, 100);
  };

  // Function to apply suggestion
  const applySuggestion = (fieldType, index, name, suggestion) => {
    if (!suggestion) return;
    
    const suggestionKey = fieldType === 'experience' ? `experience_${index}_${name}` : 
                         fieldType === 'education' ? `education_${name}` : name;
    
    let currentValue;
    if (fieldType === 'education') {
      currentValue = formData.education[name];
    } else if (fieldType === 'experience' && index !== null) {
      currentValue = formData.experience[index][name];
    } else {
      currentValue = formData[name];
    }
    
    const cursorPos = cursorPositions[suggestionKey] || currentValue.length;
    const beforeCursor = currentValue.substring(0, cursorPos);
    const afterCursor = currentValue.substring(cursorPos);
    
    // Get the last word before cursor
    const words = beforeCursor.split(/\s+/);
    const lastWord = words[words.length - 1] || '';
    
    // Replace the last word with the suggestion
    words[words.length - 1] = suggestion;
    const newBeforeCursor = words.join(' ');
    const newValue = newBeforeCursor + afterCursor;
    
    // Update form data
    if (fieldType === 'education') {
      setFormData(prev => ({
        ...prev,
        education: { ...prev.education, [name]: newValue }
      }));
    } else if (fieldType === 'experience' && index !== null) {
      const updatedExperience = [...formData.experience];
      updatedExperience[index] = { ...updatedExperience[index], [name]: newValue };
      setFormData(prev => ({ ...prev, experience: updatedExperience }));
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
    }
    
    // Clear suggestion and update cursor position
    setSuggestions(prev => ({ ...prev, [suggestionKey]: '' }));
    setCursorPositions(prev => ({
      ...prev,
      [suggestionKey]: newBeforeCursor.length
    }));
    
    // Trigger prediction for the next word after a short delay
    setTimeout(() => {
      debouncedPredict(suggestionKey, fieldType === 'experience' ? name : fieldType, newValue, newBeforeCursor.length);
    }, 100);
  };

  // Handle Tab key to accept suggestion
  const handleKeyDown = (e, fieldType = 'personal', index = null) => {
    const { name } = e.target;
    const suggestionKey = fieldType === 'experience' ? `experience_${index}_${name}` : 
                         fieldType === 'education' ? `education_${name}` : name;
    const suggestion = suggestions[suggestionKey];

    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      applySuggestion(fieldType, index, name, suggestion);
    }
  };
  
  // Add a way to click on suggestion to apply it
  const handleSuggestionClick = (fieldType, index, name, suggestion) => {
    applySuggestion(fieldType, index, name, suggestion);
  };

  // Add a button for adding another experience entry
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { companyName: '', jobTitle: '', duration: '' }]
    }));
  };

  // Remove experience entry
  const removeExperience = (index) => {
    if (formData.experience.length > 1) {
      const updatedExperience = formData.experience.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, experience: updatedExperience }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resumeData = { ...formData, email: userEmail || formData.email };
      const response = await axios.post('http://localhost:5000/api/resumes/create', resumeData);
      console.log('Resume created:', response.data);
      togglePopup();
    } catch (error) {
      console.error('Error creating resume:', error.response?.data || error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative bg-white p-8 rounded-lg w-full max-w-3xl shadow-lg overflow-auto max-h-[90vh]">
        <button
          onClick={togglePopup}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Create Resume</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Contact Details */}
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
                  onKeyDown={handleKeyDown}
                  onFocus={() => handleFocus('personal', null, 'fullName')}
                  onBlur={handleBlur}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Your Full Name"
                  required
                />
                {activeField === 'fullName' && suggestions.fullName && (
                  <div 
                    className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleSuggestionClick('personal', null, 'fullName', suggestions.fullName)}
                  >
                    Suggestion: {suggestions.fullName} (Tab to accept or click)
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userEmail || formData.email}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => handleFocus('personal', null, 'email')}
                  onBlur={handleBlur}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Your Email"
                  required
                  disabled={!!userEmail}
                />
                {activeField === 'email' && suggestions.email && (
                  <div 
                    className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleSuggestionClick('personal', null, 'email', suggestions.email)}
                  >
                    Suggestion: {suggestions.email} (Tab to accept or click)
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => handleFocus('personal', null, 'phoneNumber')}
                  onBlur={handleBlur}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Your Phone Number"
                  required
                />
                {activeField === 'phoneNumber' && suggestions.phoneNumber && (
                  <div 
                    className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleSuggestionClick('personal', null, 'phoneNumber', suggestions.phoneNumber)}
                  >
                    Suggestion: {suggestions.phoneNumber} (Tab to accept or click)
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => handleFocus('personal', null, 'linkedin')}
                  onBlur={handleBlur}
                  className="w-full rounded border px-3 py-2"
                  placeholder="LinkedIn Profile URL"
                />
                {activeField === 'linkedin' && suggestions.linkedin && (
                  <div 
                    className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleSuggestionClick('personal', null, 'linkedin', suggestions.linkedin)}
                  >
                    Suggestion: {suggestions.linkedin} (Tab to accept or click)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Education</h3>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <label className="block text-sm text-gray-600">School/University</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.education.institution}
                  onChange={(e) => handleInputChange(e, 'education')}
                  onKeyDown={(e) => handleKeyDown(e, 'education')}
                  onFocus={() => handleFocus('education', null, 'institution')}
                  onBlur={handleBlur}
                  className="w-full rounded border px-3 py-2"
                  placeholder="Institution Name"
                  required
                />
                {activeField === 'education_institution' && suggestions.education_institution && (
                  <div 
                    className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleSuggestionClick('education', null, 'institution', suggestions.education_institution)}
                  >
                    Suggestion: {suggestions.education_institution} (Tab to accept or click)
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">Degree</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.education.degree}
                  onChange={(e) => handleInputChange(e, 'education')}
                  onKeyDown={(e) => handleKeyDown(e, 'education')}
                  onFocus={() => handleFocus('education', null, 'degree')}
                  onBlur={handleBlur}
                  className="w-full rounded border px-3 py-2"
                  placeholder="e.g., B.Sc. in Computer Science"
                  required
                />
                {activeField === 'education_degree' && suggestions.education_degree && (
                  <div 
                    className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleSuggestionClick('education', null, 'degree', suggestions.education_degree)}
                  >
                    Suggestion: {suggestions.education_degree} (Tab to accept or click)
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600">Graduation Year</label>
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.education.graduationYear}
                  onChange={(e) => handleInputChange(e, 'education')}
                  onKeyDown={(e) => handleKeyDown(e, 'education')}
                  onFocus={() => handleFocus('education', null, 'graduationYear')}
                  onBlur={handleBlur}
                  className="w-full rounded border px-3 py-2"
                  placeholder="e.g., 2023"
                  required
                />
                {activeField === 'education_graduationYear' && suggestions.education_graduationYear && (
                  <div 
                    className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => handleSuggestionClick('education', null, 'graduationYear', suggestions.education_graduationYear)}
                  >
                    Suggestion: {suggestions.education_graduationYear} (Tab to accept or click)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Skills</h3>
            <div className="mt-4">
              <label className="block text-sm text-gray-600">List Your Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => handleFocus('personal', null, 'skills')}
                onBlur={handleBlur}
                className="w-full rounded border px-3 py-2"
                rows="3"
                placeholder="e.g., JavaScript, React, Python"
              />
              {activeField === 'skills' && suggestions.skills && (
                <div 
                  className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => handleSuggestionClick('personal', null, 'skills', suggestions.skills)}
                >
                  Suggestion: {suggestions.skills} (Tab to accept or click)
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
              <span>Experience</span>
              <button
                type="button"
                onClick={addExperience}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add More Experience
              </button>
            </h3>
            {formData.experience.map((exp, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 mt-4 border p-4 rounded">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Experience #{index + 1}</h4>
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={exp.companyName}
                    onChange={(e) => handleInputChange(e, 'experience', index)}
                    onKeyDown={(e) => handleKeyDown(e, 'experience', index)}
                    onFocus={() => handleFocus('experience', index, 'companyName')}
                    onBlur={handleBlur}
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., ABC Tech Ltd."
                    required
                  />
                  {activeField === `experience_${index}_companyName` &&
                    suggestions[`experience_${index}_companyName`] && (
                      <div 
                        className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => handleSuggestionClick('experience', index, 'companyName', suggestions[`experience_${index}_companyName`])}
                      >
                        Suggestion: {suggestions[`experience_${index}_companyName`]} (Tab to accept or click)
                      </div>
                    )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={exp.jobTitle}
                    onChange={(e) => handleInputChange(e, 'experience', index)}
                    onKeyDown={(e) => handleKeyDown(e, 'experience', index)}
                    onFocus={() => handleFocus('experience', index, 'jobTitle')}
                    onBlur={handleBlur}
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., Software Engineer"
                    required
                  />
                  {activeField === `experience_${index}_jobTitle` &&
                    suggestions[`experience_${index}_jobTitle`] && (
                      <div 
                        className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => handleSuggestionClick('experience', index, 'jobTitle', suggestions[`experience_${index}_jobTitle`])}
                      >
                        Suggestion: {suggestions[`experience_${index}_jobTitle`]} (Tab to accept or click)
                      </div>
                    )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={exp.duration}
                    onChange={(e) => handleInputChange(e, 'experience', index)}
                    onKeyDown={(e) => handleKeyDown(e, 'experience', index)}
                    onFocus={() => handleFocus('experience', index, 'duration')}
                    onBlur={handleBlur}
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., Jan 2020 - Dec 2022"
                    required
                  />
                  {activeField === `experience_${index}_duration` &&
                    suggestions[`experience_${index}_duration`] && (
                      <div 
                        className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => handleSuggestionClick('experience', index, 'duration', suggestions[`experience_${index}_duration`])}
                      >
                        Suggestion: {suggestions[`experience_${index}_duration`]} (Tab to accept or click)
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Certifications</h3>
            <div className="mt-4">
              <input
                type="text"
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => handleFocus('personal', null, 'certifications')}
                onBlur={handleBlur}
                className="w-full rounded border px-3 py-2"
                placeholder="e.g., AWS Certified Developer"
              />
              {activeField === 'certifications' && suggestions.certifications && (
                <div 
                  className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => handleSuggestionClick('personal', null, 'certifications', suggestions.certifications)}
                >
                  Suggestion: {suggestions.certifications} (Tab to accept or click)
                </div>
              )}
            </div>
          </div>

          {/* Hobbies */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Hobbies</h3>
            <div className="mt-4">
              <textarea
                name="hobbies"
                value={formData.hobbies}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => handleFocus('personal', null, 'hobbies')}
                onBlur={handleBlur}
                className="w-full rounded border px-3 py-2"
                rows="3"
                placeholder="e.g., Reading, Traveling"
              />
              {activeField === 'hobbies' && suggestions.hobbies && (
                <div 
                  className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => handleSuggestionClick('personal', null, 'hobbies', suggestions.hobbies)}
                >
                  Suggestion: {suggestions.hobbies} (Tab to accept or click)
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
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