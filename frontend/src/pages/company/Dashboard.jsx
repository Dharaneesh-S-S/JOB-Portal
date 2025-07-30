import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCompanyJobs, createJobPosting } from '../../services/api';

// Components
import CompanyNavbar from '../../components/company/Navbar';
import JobPostingForm from '../../components/company/JobPostingForm';
import JobList from '../../components/company/JobList';
import StatsCard from '../../components/common/StatsCard';

const CompanyDashboard = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getCompanyJobs(currentUser.token);
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentUser.token]);

  const handleCreateJob = async (jobData) => {
    try {
      const response = await createJobPosting(currentUser.token, jobData);
      setJobs([...jobs, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <CompanyNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Jobs" 
            value={jobs.length} 
            icon={<i className="fas fa-briefcase text-blue-500"></i>} 
          />
          <StatsCard 
            title="Active Applicants" 
            value={jobs.reduce((acc, job) => acc + job.applicants.length, 0)} 
            icon={<i className="fas fa-users text-green-500"></i>} 
          />
          <StatsCard 
            title="Priority Candidates" 
            value={currentUser.priorityCandidates?.length || 0} 
            icon={<i className="fas fa-star text-yellow-500"></i>} 
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Job Postings</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : 'Post New Job'}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <JobPostingForm onSubmit={handleCreateJob} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <JobList jobs={jobs} />
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;