import React from 'react';
import ApplicantCard from './ApplicantCard';

const ApplicantList = ({ applicants, jobId }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Applicants ({applicants.length})</h3>
      
      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants yet</p>
      ) : (
        <div className="space-y-4">
          {applicants.map(applicant => (
            <ApplicantCard 
              key={applicant._id} 
              applicant={applicant} 
              jobId={jobId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantList;