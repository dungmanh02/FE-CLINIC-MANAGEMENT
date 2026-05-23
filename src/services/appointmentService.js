import api from '../utils/api';

// Gọi API tạo lịch hẹn mới (POST /api/v1/appointments)
export const createAppointmentAPI = async (appointmentData) => {
    return await api.post('/appointments', appointmentData);
};
// lấy danh sách lịch hẹn
export const getAllAppointmentsAPI = async (page = 0, size = 10) => {
    return await api.get(`/appointments?page=${page}&size=${size}`);
};
// xem chi chi tiết một lịch hẹn
export const getAppointmentDetailsAPI = async (id) => {
    return await api.get(`/appointments/${id}`);
};
//xác nhận lịch hẹn(doctor and patient)
export const confirmAppointmentAPI = async (id) => {
    return await api.patch(`/appointments/${id}/confirm`);
};

// hủy lịch hẹn(doctor and patient)
export const cancelAppointmentAPI = async (id, reasonData) => {
    // reasonData có dạng: { reason: "Lý do hủy..." }
    return await api.patch(`/appointments/${id}/cancel`, reasonData);
};
// xóa/hủy trạng thái lịch hẹn
export const deleteAppointmentAPI = async (id) => {
    return await api.delete(`/appointments/${id}`);
};