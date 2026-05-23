import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateDoctorAPI, getAllDoctorsAPI, searchDoctorsAPI } from '../../services/adminService';
import { getAllDepartmentsAPI, createDepartmentAPI, updateDepartmentAPI, deleteDepartmentAPI } from '../../services/departmentService';
import { createAppointmentAPI, getAppointmentDetailsAPI, deleteAppointmentAPI } from '../../services/appointmentService'; 
import '../../style/base.css';
import '../../style/admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');

  // STATE BÁC SĨ
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // STATE PHÒNG BAN
  const [specialties, setSpecialties] = useState([]);
  const [isDeptLoading, setIsDeptLoading] = useState(false);
  
  // STATE THUỐC
  const [drugs, setDrugs] = useState(() => JSON.parse(localStorage.getItem('admin_drugs')) || [
    { id: 1, name: "Paracetamol", ingredient: "Acetaminophen", unit: "Viên", price: 5000 }
  ]);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', isEdit: false });
  const [formData, setFormData] = useState({});

  // STATE TRA CỨU CHI TIẾT LỊCH HẸN CỦA ADMIN
  const [searchApptId, setSearchApptId] = useState('');
  const [apptDetails, setApptDetails] = useState(null);
  const [isApptDetailModalOpen, setIsApptDetailModalOpen] = useState(false);

  // ================== API LẤY DỮ LIỆU ==================
  const fetchDoctors = async (searchKeyword = '') => {
    setIsLoading(true);
    try {
      let response;
      if (searchKeyword.trim() !== '') {
        response = await searchDoctorsAPI(searchKeyword);
      } else {
        response = await getAllDoctorsAPI(0);
      }
      const actualDoctorArray = response.data?.data?.doctors || response.data?.data?.doctorList || response.data?.data?.content || response.data?.data || [];
      setDoctors(Array.isArray(actualDoctorArray) ? actualDoctorArray : []);
    } catch (error) {
      console.error("Lỗi tải/tìm kiếm danh sách bác sĩ:", error);
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    setIsDeptLoading(true);
    try {
      const response = await getAllDepartmentsAPI(0);
      const actualDeptArray = response.data?.data?.departments || response.data?.data?.content || response.data?.data || [];
      setSpecialties(Array.isArray(actualDeptArray) ? actualDeptArray : []);
    } catch (error) {
      console.error("Lỗi tải danh sách phòng ban:", error);
      setSpecialties([]);
    } finally {
      setIsDeptLoading(false);
    }
  };

  // ================== EFFECTS ==================
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ================== HANDLERS ==================
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Xóa mục này khỏi hệ thống?`)) {
      if (type === 'specialty') {
        try {
          await deleteDepartmentAPI(id);
          fetchDepartments(); 
          alert("🎉 Xóa phòng ban thành công!");
        } catch (error) {
          console.error("Lỗi xóa phòng ban:", error);
          alert("Xóa thất bại. Vui lòng kiểm tra lại kết nối!");
        }
      }
      if (type === 'drug') setDrugs(drugs.filter(d => d.id !== id));
      if (type === 'doctor') alert("Chức năng xóa bác sĩ đang cập nhật API!");
    }
  };

  const openModal = (type, data = null) => {
    setModalConfig({ isOpen: true, type, isEdit: !!data });
    setFormData(data || {});
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', isEdit: false });
    setFormData({});
  };

  // HÀM GỌI API LẤY CHI TIẾT LỊCH HẸN CHO ADMIN
  const handleViewAppointmentDetails = async (id) => {
    if (!id) return alert("Vui lòng nhập ID lịch hẹn!");
    try {
      const response = await getAppointmentDetailsAPI(id);
      setApptDetails(response.data?.data || response.data);
      setIsApptDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết lịch hẹn:", error);
      alert("Không tìm thấy lịch hẹn hoặc mã ID không chính xác!");
    }
  };

  // 🚀 HÀM ADMIN BẤM XÓA LỊCH HẸN KHỎI HỆ THỐNG
  const handleAdminDeleteAppointment = async (id) => {
    if (window.confirm(`⚠️ Bạn có chắc chắn muốn XÓA HOÀN TOÀN lịch hẹn #${id} này khỏi hệ thống không?`)) {
      try {
        await deleteAppointmentAPI(id);
        alert("🗑️ Đã xóa lịch hẹn thành công!");
        setIsApptDetailModalOpen(false); // Đóng modal chi tiết luôn
        setSearchApptId(''); // Clear ô nhập
      } catch (error) {
        console.error("Lỗi xóa lịch hẹn:", error);
        alert("Xóa lịch hẹn thất bại. Vui lòng kiểm tra lại!");
      }
    }
  };

  const handleSaveModal = async () => {
    if (modalConfig.type === 'doctor' && modalConfig.isEdit) {
      try {
        const actualUserId = formData.userId || formData.user_id || (formData.user && formData.user.id) || formData.id;
        const updatePayload = {
          userId: actualUserId,
          departmentId: parseInt(formData.departmentId),
          specialization: formData.specialization,
          experienceYears: parseInt(formData.experienceYears)
        };
        await updateDoctorAPI(updatePayload);
        fetchDoctors(searchTerm);
        alert("🎉 Cập nhật thông tin bác sĩ thành công!");
      } catch (error) {
        console.error("Lỗi cập nhật bác sĩ:", error);
        alert("Cập nhật thất bại. Vui lòng kiểm tra lại!");
        return;
      }
    }
    else if (modalConfig.type === 'specialty') {
      const payload = {
        name: formData.name || formData.departmentName,
        description: formData.description || ''
      };
      if (!modalConfig.isEdit) {
        try {
          await createDepartmentAPI(payload);
          fetchDepartments();
          alert("🎉 Tạo phòng ban thành công!");
        } catch (error) {
          console.error("Lỗi tạo phòng ban:", error);
          alert("Tạo thất bại. Vui lòng kiểm tra lại!");
          return;
        }
      } else {
        try {
          const deptId = formData.id || formData.departmentId;
          await updateDepartmentAPI(deptId, payload);
          fetchDepartments();
          alert("🎉 Cập nhật phòng ban thành công!");
        } catch (error) {
          console.error("Lỗi cập nhật phòng ban:", error);
          alert("Cập nhật thất bại. Vui lòng kiểm tra lại!");
          return;
        }
      }
    }
    else if (modalConfig.type === 'appointment') {
      try {
        const payload = {
          patientId: parseInt(formData.patientId),
          doctorId: parseInt(formData.doctorId),
          appointmentDate: formData.appointmentDate,
          startTime: formData.startTime.length === 5 ? formData.startTime + ":00" : formData.startTime,
          symptoms: formData.symptoms || "Khám bệnh tổng quát"
        };
        await createAppointmentAPI(payload);
        alert("🎉 Admin tạo lịch hẹn thành công hộ Bệnh nhân!");
      } catch (error) {
        console.error("Lỗi tạo lịch hẹn:", error);
        alert("Tạo lịch hẹn thất bại. Vui lòng kiểm tra lại ID!");
        return;
      }
    }
    closeModal();
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div>
          <div className="logo">
            <span className="logo-icon">  ✚  </span>
            <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
          </div>
          <nav className="nav-menu">
            <div className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>
              <span className="icon">  👥  </span> Quản lý tài khoản
            </div>
            <div className="nav-item" onClick={() => navigate('/admin/create-doctor')} style={{ backgroundColor: '#eff6ff', color: '#0f6eff', fontWeight: 'bold' }}>
              <span className="icon">  ➕  </span> Thêm Bác sĩ Mới
            </div>
            <div className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
              <span className="icon">  📅  </span> Quản lý Lịch hẹn
            </div>
            <div className={`nav-item ${activeTab === 'specialties' ? 'active' : ''}`} onClick={() => setActiveTab('specialties')}>
              <span className="icon">  🏥  </span> Phòng ban / Khoa
            </div>
            <div className={`nav-item ${activeTab === 'drugs' ? 'active' : ''}`} onClick={() => setActiveTab('drugs')}>
              <span className="icon">  💊  </span> Quản lý thuốc
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="nav-item logout" onClick={handleLogout}>
            <span className="icon">  🚪  </span> Đăng xuất
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <span>  🔍  </span>
            <input type="text" placeholder="Tìm kiếm bác sĩ trên Server..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="user-profile">
            <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=AdminMaster&backgroundColor=0f6eff" alt="Avatar" className="avatar" />
            <div className="user-info">
              <span className="user-name">Quản trị viên</span>
              <span className="user-role">Super Admin</span>
            </div>
          </div>
        </header>
        <div className="page-content">
          <h1 className="page-title">Bảng điều khiển quản trị</h1>
          <div className="management-grid">
            {/* TAB BÁC SĨ */}
            {activeTab === 'accounts' && (
              <div className="admin-card">
                <div className="card-header">
                  <h2><span>  👨‍⚕️  </span> Tài khoản bác sĩ</h2>
                  <button className="btn-primary" onClick={() => navigate('/admin/create-doctor')}>+ Thêm bác sĩ</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  {isLoading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Đang tìm kiếm dữ liệu trên máy chủ...</p>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr><th>ID</th><th>Họ tên</th><th>Username</th><th>Email</th><th>Chuyên khoa</th><th>Thao tác</th></tr>
                      </thead>
                      <tbody>
                        {doctors.map(doc => (
                          <tr key={doc.id || doc.userId}>
                            <td>{doc.id || doc.userId}</td>
                            <td>{doc.fullName}</td>
                            <td>{doc.username}</td>
                            <td>{doc.email}</td>
                            <td><span className="badge-specialty">{doc.specialization}</span></td>
                            <td className="action-icons">
                              <span className="edit-icon" onClick={() => openModal('doctor', doc)}>  ✏️  </span>
                              <span className="delete-icon" onClick={() => handleDelete('doctor', doc.id || doc.userId)}>  🗑️</span>
                            </td>
                          </tr>
                        ))}
                        {doctors.length === 0 && (
                          <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy bác sĩ nào</td></tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* NỘI DUNG TAB LỊCH HẸN */}
            {activeTab === 'appointments' && (
              <div className="admin-card">
                <div className="card-header">
                  <h2><span>  📅  </span> Quản lý danh sách lịch hẹn</h2>
                  <button className="btn-primary" onClick={() => openModal('appointment')}>+ Đặt lịch hộ Bệnh nhân</button>
                </div>
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>📬 Tính năng hiển thị danh sách lịch hẹn sắp ra mắt!</p>
                  <p style={{ fontSize: '13px', marginBottom: '25px' }}>Admin có thể bấm nút trên để gọi API POST tạo cuộc hẹn.</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '420px', margin: '0 auto', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <input 
                      type="number" 
                      placeholder="Nhập ID lịch hẹn cần tra cứu..." 
                      value={searchApptId} 
                      onChange={(e) => setSearchApptId(e.target.value)} 
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1, fontSize: '14px' }}
                    />
                    <button className="btn-primary" onClick={() => handleViewAppointmentDetails(searchApptId)} style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>Xem chi tiết</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB PHÒNG BAN */}
            {activeTab === 'specialties' && (
              <div className="admin-card">
                <div className="card-header">
                  <h2><span>  🏥  </span> Danh sách phòng ban</h2>
                  <button className="btn-primary" onClick={() => openModal('specialty')}>+ Thêm phòng ban</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Tên phòng ban</th><th>Mô tả</th><th>Thao tác</th></tr></thead>
                    <tbody>
                      {isDeptLoading ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu từ máy chủ...</td></tr>
                      ) : specialties.length > 0 ? (
                        specialties.map(spec => (
                          <tr key={spec.id || spec.departmentId}>
                            <td>{spec.id || spec.departmentId}</td>
                            <td><span className="badge-specialty">{spec.name || spec.departmentName}</span></td>
                            <td>{spec.description || 'Chưa có mô tả'}</td>
                            <td className="action-icons">
                              <span className="edit-icon" onClick={() => openModal('specialty', spec)}>  ✏️  </span>
                              <span className="delete-icon" onClick={() => handleDelete('specialty', spec.id || spec.departmentId)}>  🗑️</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Không có dữ liệu phòng ban</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* TAB THUỐC */}
            {activeTab === 'drugs' && (
              <div className="admin-card">
                <div className="card-header">
                  <h2><span>  💊  </span> Kho thuốc & dược phẩm</h2>
                  <button className="btn-primary" onClick={() => openModal('drug')}>+ Thêm thuốc</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Tên thuốc</th><th>Hoạt chất</th><th>Đơn vị</th><th>Giá (VNĐ)</th><th>Thao tác</th></tr></thead>
                    <tbody>
                      {drugs.map(d => (
                        <tr key={d.id}>
                          <td>{d.id}</td><td><strong>{d.name}</strong></td><td>{d.ingredient}</td><td>{d.unit}</td><td>{d.price?.toLocaleString()}</td>
                          <td className="action-icons">
                            <span className="edit-icon" onClick={() => openModal('drug', d)}>  ✏️  </span>
                            <span className="delete-icon" onClick={() => handleDelete('drug', d.id)}>  🗑️</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {modalConfig.isOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>{modalConfig.isEdit ? '  ✏️  Cập nhật thông tin' : '  ➕  Thêm mới'}</h3>
            {modalConfig.type === 'doctor' && (
              <>
                <input type="text" placeholder="Họ tên (Chỉ xem)" value={formData.fullName || ''} disabled style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed' }} />
                <input type="number" placeholder="ID Phòng khoa (VD: 1, 2...)" value={formData.departmentId || ''} onChange={e => setFormData({...formData, departmentId: e.target.value})} required />
                <input type="text" placeholder="Chuyên môn (VD: Thạc sĩ Nội khoa)" value={formData.specialization || ''} onChange={e => setFormData({...formData, specialization: e.target.value})} required />
                <input type="number" placeholder="Số năm kinh nghiệm" value={formData.experienceYears || ''} onChange={e => setFormData({...formData, experienceYears: e.target.value})} required />
              </>
            )}
            {modalConfig.type === 'specialty' && (
              <>
                <input type="text" placeholder="Tên phòng ban *" value={formData.name || formData.departmentName || ''} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={modalConfig.isEdit} />
                <input type="text" placeholder="Mô tả" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </>
            )}
            {modalConfig.type === 'drug' && (
              <>
                <input type="text" placeholder="Tên thuốc" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="number" placeholder="Giá (VNĐ)" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
              </>
            )}
            <div className="modal-actions">
              <button className="btn-outline" onClick={closeModal}>Hủy</button>
              <button className="btn-primary" onClick={handleSaveModal}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT LỊCH HẸN + NÚT XÓA DÀNH CHO ADMIN */}
      {isApptDetailModalOpen && apptDetails && (
        <div className="modal" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>📄 Chi tiết Lịch hẹn #{apptDetails.id}</h3>
            <div style={{ textAlign: 'left', margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
              <p style={{ margin: 0 }}><strong>👤 Bệnh nhân:</strong> {apptDetails.patientName || 'Chưa rõ'}</p>
              <p style={{ margin: 0 }}><strong>👨‍⚕️ Bác sĩ điều trị:</strong> {apptDetails.doctorName || 'Chưa rõ'}</p>
              <p style={{ margin: 0 }}><strong>📅 Ngày khám:</strong> {apptDetails.appointmentDate}</p>
              <p style={{ margin: 0 }}><strong>⏰ Giờ hẹn:</strong> {apptDetails.startTime}</p>
              <p style={{ margin: 0 }}><strong>📌 Trạng thái:</strong> <span className={`status-badge ${apptDetails.status === 'PENDING' ? 'pending' : (apptDetails.status === 'CANCELLED' ? 'cancelled' : 'confirmed')}`}>{apptDetails.status}</span></p>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
              {/* 🚀 NÚT XÓA LỊCH HẸN KHỎI DATABASE */}
              <button onClick={() => handleAdminDeleteAppointment(apptDetails.id)} style={{ padding: '10px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Xóa lịch này</button>
              <button className="btn-primary" onClick={() => setIsApptDetailModalOpen(false)}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;