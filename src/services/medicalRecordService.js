import api from '../utils/api';

export const createMedicalRecordAPI = async (recordData) => {
    return await api.post('/medical-records', recordData);
};

//API xem chi tiết bệnh án
export const getMedicalRecordDetailsAPI = async (id) => {
    return await api.get(`/medical-records/${id}`);
};
//hàm xem lịch sử tất cả bệnh án của bệnh nhân theo id
export const getMedicalHistoryByPatientAPI = async (patientId) => {
    return await api.get(`/medical-records?patientId=${patientId}`);
};
//API bổ sung thuốc vào bệnh án
export const addMedicinesToRecordAPI = async (recordId, medicinesData) => {
    return await api.post(`/medical-records/${recordId}/medicines`, medicinesData);
};
// API lấy danh sách đơn thuốc theo ID bệnh án
export const getPrescriptionsByRecordAPI = async (recordId) => {
    return await api.get(`/medical-records/${recordId}/prescriptions`);
};