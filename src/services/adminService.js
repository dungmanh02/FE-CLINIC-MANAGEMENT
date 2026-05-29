import api from '../utils/api';

// API Tạo mới bác sĩ (POST /api/v1/doctors) - Cần quyền Admin
export const createDoctorAPI = async (doctorData) => {
    return await api.post('/doctors', doctorData);
};
// API Cập nhật thông tin bác sĩ (PATCH /api/v1/doctors) - Cần quyền Admin
export const updateDoctorAPI = async (updateData) => {
    return await api.patch('/doctors', updateData);
};
// 3. THÊM MỚI: API Lấy danh sách bác sĩ (GET /api/v1/doctors)
export const getAllDoctorsAPI = async (page = 0) => {
    return await api.get(`/doctors?page=${page}`);
};
// 4. API Tìm kiếm (GET /api/v1/search)
export const searchDoctorsAPI = async (keyword) => {
    // Truyền keyword lên URL theo chuẩn query parameter
    return await api.get(`/search?keyword=${keyword}`); 
};


// 5. API Lấy danh sách tất cả người dùng (Để Admin lọc ra Bệnh nhân)
export const getAllUsersAPI = async (page = 0, size = 100) => {
    return await api.get(`/users?page=${page}&size=${size}`); 
};

// 6. API Khóa (Xóa mềm) tài khoản người dùng
export const softDeleteUserAPI = async (id) => {
    return await api.delete(`/users/${id}`);
};