import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { database, dbRef, push, set } from '../services/firebaseClient';
import { analyzeReportApi } from '../services/api';

const UploadCard = ({ onAnalyzed }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to upload.');
      return;
    }
    if (!file) {
      setError('Please select a PDF or image report.');
      return;
    }

    setError('');
    setAnalyzing(true);

    try {
      // Send file directly to backend for OCR + analysis
      const analysisData = await analyzeReportApi(file);

      const reportRef = push(dbRef(database, `users/${user.uid}/reports`));
      const reportRecord = {
        fileName: file.name,
        createdAt: Date.now(),
        analysis: analysisData,
      };
      await set(reportRef, reportRecord);

      if (onAnalyzed) {
        onAnalyzed({ id: reportRef.key, ...reportRecord });
      }

      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to upload or analyze report.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <input
          className="form-control"
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileChange}
        />
      </div>
      {error && (
        <div className="alert alert-danger py-1 small" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
        disabled={analyzing}
      >
        {analyzing ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Analyzing...
          </>
        ) : (
          <>
            <i className="bi bi-magic me-2"></i>
            Analyze Report
          </>
        )}
      </button>
    </form>
  );
};

export default UploadCard;

