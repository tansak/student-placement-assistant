import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const googleAuth = (credential) => api.post('/auth/google', { credential });
export const getMe = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Assessments
export const createAssessment = (data) => api.post('/assessments', data);
export const getAssessments = () => api.get('/assessments');
export const getAssessment = (id) => api.get(`/assessments/${id}`);
export const completeItem = (id, data) =>
  api.patch(`/assessments/${id}/complete-item`, data);
export const uncompleteItem = (id, data) =>
  api.patch(`/assessments/${id}/uncomplete-item`, data);
export const deleteAssessment = (id) => api.delete(`/assessments/${id}`);

export default api;
