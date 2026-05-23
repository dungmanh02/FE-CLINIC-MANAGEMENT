import api from '../utils/api';

// API Lấy danh sách phòng ban/chuyên khoa (Dùng chung cho Admin, Doctor, Patient)
export const getAllDepartmentsAPI = async (page = 0) => {
    return await api.get(`/departments?page=${page}`);
};
//API tạo phòng ban
export const createDepartmentAPI = async (deptData) => {
    return await api.post('/departments', deptData);
};
// cập nhật thông tin khoa
export const updateDepartmentAPI = async (id, deptData) => {
    return await api.patch(`/departments/${id}`, deptData);
};
// xóa mềm phòng ban
export const deleteDepartmentAPI = async (id) => {
    return await api.patch(`/departments/${id}/delete`);
};

