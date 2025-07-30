import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth API
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);

// Profile API
export const getProfile = (token) => api.get('/profile', { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (token, profileData) => api.put('/profile', profileData, { headers: { Authorization: `Bearer ${token}` } });

// Resume API
export const uploadResume = (token, file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
};

export const analyzeResume = (token, resumeUrl) => api.post('/resume/analyze', { url: resumeUrl });

// Jobs API
export const getCompanyJobs = (token) => api.get('/company/jobs');
export const createJobPosting = (token, jobData) => api.post('/company/jobs', jobData);

export default api;