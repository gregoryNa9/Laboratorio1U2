import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // tu backend local
});

export const getCourses = () => api.get('/course');
export const addCourse = (data) => api.post('/course', data);
export const updateCourse = (id, data) => api.put(`/course/${id}`, data);
export const deleteCourse = (id) => api.delete(`/course/${id}`);


export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);


export const getLabs = () => api.get('/lab');
export const addLab = (data) => api.post('/lab', data);
export const updateLab = (id, data) => api.put(`/lab/${id}`, data);
export const deleteLab = (id) => api.delete(`/lab/${id}`);