import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, uploadResume, analyzeResume } from '../../services/api';

const ProfileBuilder = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Calculate profile completion percentage
  const calculateProgress = (user) => {
    const requiredFields = [
      'fullName', 'email', 'phoneNumber', 'education', 
      'skills', 'resume', 'experience', 'projects'
    ];
    const completedFields = requiredFields.filter(field => 
      user[field] && (Array.isArray(user[field]) ? user[field].length > 0 : true)
    ).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  useEffect(() => {
    if (currentUser) {
      // Set form values from current user data
      Object.entries(currentUser).forEach(([key, value]) => {
        setValue(key, value);
      });
      setProgress(calculateProgress(currentUser));
    }
  }, [currentUser, setValue]);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const analyzeResumeHandler = async () => {
    if (!resumeFile) return;
    
    try {
      setLoading(true);
      // First upload the resume
      const uploadResponse = await uploadResume(currentUser.token, resumeFile);
      
      // Then analyze it
      const analysisResponse = await analyzeResume(currentUser.token, uploadResponse.data.url);
      setResumeAnalysis(analysisResponse.data);
      
      // Update user's resume URL
      setCurrentUser({
        ...currentUser,
        resume: uploadResponse.data.url
      });
    } catch (error) {
      console.error('Resume analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await updateProfile(currentUser.token, data);
      setCurrentUser(response.data.user);
      setProgress(calculateProgress(response.data.user));
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Profile</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{progress}% complete</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                {...register("fullName", { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">This field is required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* More personal info fields... */}
          </div>
        </div>

        {/* Resume Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resume & Analysis</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <button
              type="button"
              onClick={analyzeResumeHandler}
              disabled={!resumeFile || loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
            
            {resumeAnalysis && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium text-gray-900 mb-2">Resume Analysis Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-md shadow">
                    <p className="text-sm text-gray-500">ATS Score</p>
                    <p className="text-2xl font-bold">{resumeAnalysis.score}/100</p>
                  </div>
                  <div className="p-3 bg-white rounded-md shadow">
                    <p className="text-sm text-gray-500">Skill Match</p>
                    <p className="text-2xl font-bold">{resumeAnalysis.skillMatch}%</p>
                  </div>
                  <div className="p-3 bg-white rounded-md shadow">
                    <p className="text-sm text-gray-500">Missing Keywords</p>
                    <p className="text-2xl font-bold">{resumeAnalysis.missingKeywords.length}</p>
                  </div>
                </div>
                
                {resumeAnalysis.suggestions.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-1">Suggestions for Improvement</h5>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {resumeAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileBuilder;