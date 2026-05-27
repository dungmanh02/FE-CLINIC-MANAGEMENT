
import api from '../utils/api'; 

//API lấy danh sách thuốc
export const getAllDrugsAPI = async (page = 0, size = 100) => {
    return await api.get(`/medicines?page=${page}&size=${size}`);
};
// API thêm thuốc mới
export const createDrugAPI = async (drugData) => {
    return await api.post('/medicines', drugData);
};
// xem chi tiết thuốc
export const getDrugDetailsAPI = async (id) => {
    return await api.get(`/medicines/${id}`);
};
// sửa thông tin thuốc
export const updateDrugAPI = async (id, drugData) => {
    return await api.patch(`/medicines/${id}`, drugData);
};
// Xóa thuốc 
export const deleteDrugAPI = async (id) => {
    return await api.patch(`/medicines/${id}/delete`);
};