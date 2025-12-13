import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

export const createReviewApi = (trailId, data) => {
    // data is FormData
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/trails/${trailId}/reviews`, data, {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    });
};

export const getReviewsApi = (trailId) => {
    return axios.get(`${API_URL}/trails/${trailId}/reviews`);
};
