import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/base.css';
import '../../style/admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ----- STATES DỮ LIỆU -----
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Khởi tạo dữ liệu từ LocalStorage hoặc dùng dữ liệu mẫu
  const [doctors, setDoctors] = useState(() => JSON.parse(localStorage.getItem('admin_doctors')) || [
    { id: 1, fullname: "Trần Thu Hà", username: "dr.hatha", email: "dr.ha@medipro.com", specialty: "Nhi khoa" },
    { id: 2, fullname: "Lê Văn Nam", username: "dr.nam", email: "dr.nam@medipro.com", specialty: "Nội tổng quát" },
    { id: 3, fullname: "Phạm Minh Tuấn", username: "dr.tuan", email: "dr.tuan@medipro.com", specialty: "Răng Hàm Mặt" }
  ]);
  
  const [specialties, setSpecialties] = useState(() => JSON.parse(localStorage.getItem('admin_specialties')) || [
    { id: 1, name: "Nhi khoa", description: "Chăm sóc sức khỏe trẻ em" },
    { id: 2, name: "Nội tổng quát", description: "Khám & điều trị nội khoa" },
    { id: 3, name: "Răng Hàm Mặt", description: "Điều trị răng miệng" }
  ]);

  const [drugs, setDrugs] = useState(() => JSON.parse(localStorage.getItem('admin_drugs')) || [
    { id: 1, name: "Paracetamol", ingredient: "Acetaminophen", unit: "Viên", price: 5000 },
    { id: 2, name: "Amoxicillin", ingredient: "Amoxicillin trihydrate", unit: "Hộp", price: 45000 },
    { id: 3, name: "Vitamin C", ingredient: "Ascorbic acid", unit: "Ống", price: 12000 }
  ]);

  // ----- MODAL STATES -----
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', isEdit: false });
  const [formData, setFormData] = useState({});

  // Cập nhật LocalStorage mỗi khi dữ liệu thay đổi
  useEffect(() => { localStorage.setItem('admin_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('admin_specialties', JSON.stringify(specialties)); }, [specialties]);
  useEffect(() => { localStorage.setItem('admin_drugs', JSON.stringify(drugs)); }, [drugs]);

  // ----- HÀM XỬ LÝ -----
  const handleLogout = () => {
    alert("Đăng xuất khỏi hệ thống quản trị.");
    navigate('/login');
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Xóa mục này khỏi hệ thống?`)) {
      if (type === 'doctor') setDoctors(doctors.filter(d => d.id !== id));
      if (type === 'specialty') setSpecialties(specialties.filter(s => s.id !== id));
      if (type === 'drug') setDrugs(drugs.filter(d => d.id !== id));
    }
  };

  const openModal = (type, data = null) => {
    setModalConfig({ isOpen: true, type, isEdit: !!data });
    setFormData(data || {}); // Nếu có data là sửa, null là thêm mới
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', isEdit: false });
    setFormData({});
  };

  const handleSaveModal = () => {
    if (modalConfig.type === 'doctor') {
      if (!formData.fullname || !formData.username) return alert("Điền đủ thông tin!");
      if (modalConfig.isEdit) {
        setDoctors(doctors.map(d => d.id === formData.id ? formData : d));
      } else {
        setDoctors([...doctors, { ...formData, id: Date.now() }]);
      }
    } else if (modalConfig.type === 'specialty') {
      if (!formData.name) return alert("Điền tên chuyên khoa!");
      if (modalConfig.isEdit) {
        setSpecialties(specialties.map(s => s.id === formData.id ? formData : s));
      } else {
        setSpecialties([...specialties, { ...formData, id: Date.now() }]);
      }
    } else if (modalConfig.type === 'drug') {
      if (!formData.name || !formData.price) return alert("Điền đủ thông tin thuốc!");
      if (modalConfig.isEdit) {
        setDrugs(drugs.map(d => d.id === formData.id ? formData : d));
      } else {
        setDrugs([...drugs, { ...formData, id: Date.now() }]);
      }
    }
    closeModal();
  };

  // Lọc dữ liệu theo tìm kiếm
  const filteredDoctors = doctors.filter(d => d.fullname?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <span className="logo-icon">✚</span>
            <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
          </div>
          <nav className="nav-menu">
            <div className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>
              <span className="icon">👥</span> Quản lý tài khoản
            </div>
            <div className={`nav-item ${activeTab === 'specialties' ? 'active' : ''}`} onClick={() => setActiveTab('specialties')}>
              <span className="icon">🏥</span> Chuyên khoa
            </div>
            <div className={`nav-item ${activeTab === 'drugs' ? 'active' : ''}`} onClick={() => setActiveTab('drugs')}>
              <span className="icon">💊</span> Quản lý thuốc
            </div>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="nav-item logout" onClick={handleLogout}>
            <span className="icon">🚪</span> Đăng xuất
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="main-header">
          <div className="search-bar">
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm bác sĩ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          <p className="page-subtitle">Quản lý tài khoản bác sĩ, chuyên khoa & kho dữ liệu thuốc toàn diện.</p>
          
          <div className="management-grid">
            
            {/* TAB: BÁC SĨ */}
            {activeTab === 'accounts' && (
              <div className="admin-card">
                <div className="card-header">
                  <h2><span>👨‍⚕️</span> Tài khoản bác sĩ</h2>
                  <button className="btn-primary" onClick={() => openModal('doctor')}>+ Thêm bác sĩ</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr><th>ID</th><th>Họ tên</th><th>Username</th><th>Email</th><th>Chuyên khoa</th><th>Thao tác</th></tr>
                    </thead>
                    <tbody>
                      {filteredDoctors.map(doc => (
                        <tr key={doc.id}>
                          <td>{doc.id}</td><td>{doc.fullname}</td><td>{doc.username}</td><td>{doc.email}</td>
                          <td><span className="badge-specialty">{doc.specialty}</span></td>
                          <td className="action-icons">
                            <span className="edit-icon" onClick={() => openModal('doctor', doc)}>✏️</span>
                            <span className="delete-icon" onClick={() => handleDelete('doctor', doc.id)}>🗑️</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: CHUYÊN KHOA */}
            {activeTab === 'specialties' && (
              <div className="admin-card">
                <div className="card-header">
                  <h2><span>🏥</span> Danh sách chuyên khoa</h2>
                  <button className="btn-primary" onClick={() => openModal('specialty')}>+ Thêm chuyên khoa</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Tên chuyên khoa</th><th>Mô tả</th><th>Thao tác</th></tr></thead>
                    <tbody>
                      {specialties.map(spec => (
                        <tr key={spec.id}>
                          <td>{spec.id}</td><td><span className="badge-specialty">{spec.name}</span></td><td>{spec.description}</td>
                          <td className="action-icons">
                            <span className="edit-icon" onClick={() => openModal('specialty', spec)}>✏️</span>
                            <span className="delete-icon" onClick={() => handleDelete('specialty', spec.id)}>🗑️</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: THUỐC */}
            {activeTab === 'drugs' && (
              <div className="admin-card">
                <div className="card-header">
                  <h2><span>💊</span> Kho thuốc & dược phẩm</h2>
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
                            <span className="edit-icon" onClick={() => openModal('drug', d)}>✏️</span>
                            <span className="delete-icon" onClick={() => handleDelete('drug', d.id)}>🗑️</span>
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

      {/* GIAO DIỆN MODAL ĐỘNG */}
      {modalConfig.isOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>{modalConfig.isEdit ? '✏️ Cập nhật' : '➕ Thêm mới'}</h3>
            
            {modalConfig.type === 'doctor' && (
              <>
                <input type="text" placeholder="Họ tên" value={formData.fullname || ''} onChange={e => setFormData({...formData, fullname: e.target.value})} />
                <input type="text" placeholder="Tên đăng nhập" value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} />
                <input type="email" placeholder="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                <select value={formData.specialty || ''} onChange={e => setFormData({...formData, specialty: e.target.value})}>
                  <option value="">Chọn chuyên khoa</option>
                  {specialties.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </>
            )}

            {modalConfig.type === 'specialty' && (
              <>
                <input type="text" placeholder="Tên chuyên khoa" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="text" placeholder="Mô tả" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </>
            )}

            {modalConfig.type === 'drug' && (
              <>
                <input type="text" placeholder="Tên thuốc" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="text" placeholder="Hoạt chất" value={formData.ingredient || ''} onChange={e => setFormData({...formData, ingredient: e.target.value})} />
                <input type="text" placeholder="Đơn vị (Viên/Hộp/Lọ)" value={formData.unit || ''} onChange={e => setFormData({...formData, unit: e.target.value})} />
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
    </div>
  );
};

export default AdminDashboard;