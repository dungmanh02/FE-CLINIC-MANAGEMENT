import api from '../utils/api';

export const loginAPI = async (loginData) => {
    const response = await api.post('/auth/authentication', loginData);
    return response.data; 
};

export const registerAPI = async (registerData) => {
    const response = await api.post('/auth/registration', registerData);
    return response.data;
};

export const verifyEmailAPI = async (token) => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
};

export const resetPasswordAPI = async (email) => {
    return await api.patch(`/auth/password-resets?email=${email}`);
};


export const changePasswordAPI = async (passwordData) => {
    return await api.patch('/users/password', passwordData); 
};
export const getCurrentUserAPI = async () => {
    return await api.get('/users/me'); 
};
export const updateProfileAPI = async (profileData) => {
    return await api.patch('/users', profileData);
};

export const uploadAvatarAPI = async (formData) => {
    return await api.patch('/users/me/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};