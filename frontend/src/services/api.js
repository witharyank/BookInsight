import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookService = {
  getAllBooks: () => api.get('/books/'),
  getBookById: (id) => api.get(`/books/${id}/`),
  getRecommendations: (id) => api.get(`/recommend/${id}/`),
  syncData: () => api.post('/upload/'),
  askQuestion: (question) => api.post('/ask/', { question }),
};

export default api;
