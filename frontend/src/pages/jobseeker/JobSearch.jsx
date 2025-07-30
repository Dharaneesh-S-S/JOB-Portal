import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { searchJobs } from '../../services/api';
import JobCard from '../../components/jobseeker/JobCard';
import Filters from '../../components/jobseeker/Filters';

const JobSearch = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    experience: '',
    type: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await searchJobs(currentUser.token, filters);
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, currentUser.token]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
        <Filters filters={filters} setFilters={setFilters} />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSearch;