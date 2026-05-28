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

export const confirmAppointmentAPI = async (id) => {
    const payload = { status: "CONFIRMED" };
    return await api.patch(`/appointments/${id}/status`, payload);
};

export const cancelAppointmentAPI = async (id, reasonText) => {
    const payload = { 
        status: "CANCELLED",
        reason: reasonText
    };
    return await api.patch(`/appointments/${id}/status`, payload);
};


// xóa/hủy trạng thái lịch hẹn
export const deleteAppointmentAPI = async (id) => {
    return await api.patch(`/appointments/${id}/status/delete`);
};

// Thay đổi URL gọi sang API Users (Lấy tối đa 100 người để không bị thiếu)
export const getPatientsByDoctorAPI = async (doctorId) => {
    return await api.get('/users?page=0&size=100'); 
};


// admin gọi bệnh nhân theo bác sĩ
export const getPatientsByDoctorForAdminAPI = async (doctorId, page = 0, size = 100) => {
    return await api.get(`/users/patients-by-doctor?doctorId=${doctorId}&page=${page}&size=${size}`);
};