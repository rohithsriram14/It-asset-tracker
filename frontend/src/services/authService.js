import api from './api';

const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const authService = {
    register,
    login,
    getMe,
    logout
};

export default authService;
