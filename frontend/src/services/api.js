import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const analyzeReportApi = async (file) => {
  const formData = new FormData();
  formData.append('report', file);

  const response = await api.post('/reports/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const chatAboutReportApi = async (question, analysisContext) => {
  const response = await api.post('/reports/chat', {
    question,
    analysisContext,
  });

  return response.data;
};

