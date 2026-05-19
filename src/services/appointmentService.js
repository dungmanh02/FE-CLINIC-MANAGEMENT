import api from '../utils/api';

// Gọi API tạo lịch hẹn mới (POST /api/v1/appointments)
export const createAppointmentAPI = async (appointmentData) => {
    return await api.post('/appointments', appointmentData);
};