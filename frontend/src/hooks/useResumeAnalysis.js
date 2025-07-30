import { useState } from 'react';
import { analyzeResume } from '../services/api';

const useResumeAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async (file, token) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await analyzeResume(token, formData);
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return { analysis, loading, error, analyze };
};

export default useResumeAnalysis;