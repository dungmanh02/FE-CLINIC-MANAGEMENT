import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../style/base.css';
import '../../style/components.css';
import '../../style/doctor.css';

const DoctorExam = () => {
  const navigate = useNavigate();

  // State lưu trữ danh sách thuốc được kê
  const [prescriptions, setPrescriptions] = useState([
    { medicine: 'Paracetamol 500mg', quantity: '', usage: '' } // Khởi tạo sẵn 1 dòng trống
  ]);

  // Hàm quay lại trang trước đó
  const handleGoBack = () => {
    navigate(-1); // Tương đương history.back() trong JS thuần
  };

  // Hàm thêm một hàng thuốc mới
  const handleAddMedicine = () => {
    setPrescriptions([...prescriptions, { medicine: '', quantity: '', usage: '' }]);
  };

  // Hàm xóa một hàng thuốc
  const handleDeleteMedicine = (indexToRemove) => {
    const updatedPrescriptions = prescriptions.filter((_, index) => index !== indexToRemove);
    setPrescriptions(updatedPrescriptions);
  };

  // Hàm cập nhật dữ liệu khi gõ vào ô input của từng thuốc
  const handleChangeMedicine = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">✚</span>
          <span className="logo-text">Medi<span className="text-primary">Pro</span></span>
        </div>
        <nav className="nav-menu">
          <Link to="/doctor/dashboard" className="nav-item">
            <span className="icon">📊</span> Tổng quan
          </Link>
          <Link to="/doctor/appointments" className="nav-item">
            <span className="icon">📅</span> Lịch hẹn
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="main-header">
          <button className="btn-action secondary" onClick={handleGoBack}>← Quay lại</button>
          <div className="user-profile">
            <span className="user-name">Đang khám: <b>Nguyễn Văn Mạnh</b></span>
          </div>
        </header>

        <div className="page-content">
          <div className="exam-grid">
            
            {/* THÔNG TIN BỆNH NHÂN (CỘT TRÁI) */}
            <div className="exam-sidebar">
              <div className="card patient-summary">
                <img src="https://api.dicebear.com/8.x/adventurer/svg?seed=NVM" className="avatar-lg" alt="Bệnh nhân" />
                <h3>Nguyễn Văn Mạnh</h3>
                <p>Nam - 25 tuổi</p>
                <hr style={{ margin: '15px 0', opacity: 0.1 }} />
                <div className="patient-note" style={{ textAlign: 'left' }}>
                  <label style={{ fontWeight: 600 }}>Lý do khám:</label>
                  <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem' }}>
                    Đau bụng dưới vùng sườn phải, buồn nôn nhẹ.
                  </p>
                </div>
              </div>

              <div className="card history-card" style={{ marginTop: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>Lịch sử khám</h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.6 }}>
                  <li>• 15/03/2026: Rối loạn tiêu hóa</li>
                  <li>• 10/01/2026: Kiểm tra sức khỏe</li>
                </ul>
              </div>
            </div>

            {/* FORM KHÁM BỆNH (CỘT PHẢI) */}
            <div className="exam-main">
              <div className="card">
                <h2 style={{ marginBottom: '20px' }}>Lập Bệnh Án</h2>

                <div className="form-section" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Chẩn đoán bệnh</label>
                  <textarea className="custom-input" rows="3" placeholder="Nhập kết luận chẩn đoán..."></textarea>
                </div>

                <div className="form-section" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Kê đơn thuốc</label>
                  
                  {/* Khu vực render danh sách thuốc động */}
                  <div id="prescription-area">
                    {prescriptions.map((item, index) => (
                      <div key={index} className="prescription-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select 
                          className="custom-select" 
                          style={{ flex: 2 }}
                          value={item.medicine}
                          onChange={(e) => handleChangeMedicine(index, 'medicine', e.target.value)}
                        >
                          <option value="Paracetamol 500mg">Paracetamol 500mg</option>
                          <option value="Amoxicillin">Amoxicillin</option>
                          <option value="Berberin">Berberin</option>
                        </select>
                        
                        <input 
                          type="number" 
                          placeholder="SL" 
                          className="custom-input" 
                          style={{ flex: 0.5 }} 
                          value={item.quantity}
                          onChange={(e) => handleChangeMedicine(index, 'quantity', e.target.value)}
                        />
                        
                        <input 
                          type="text" 
                          placeholder="Cách dùng" 
                          className="custom-input" 
                          style={{ flex: 2 }} 
                          value={item.usage}
                          onChange={(e) => handleChangeMedicine(index, 'usage', e.target.value)}
                        />
                        
                        <button 
                          className="btn-delete" 
                          style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', width: '40px', cursor: 'pointer' }}
                          onClick={() => handleDeleteMedicine(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button className="btn-action secondary" onClick={handleAddMedicine} style={{ marginTop: '10px' }}>
                    + Thêm thuốc
                  </button>
                </div>

                <div className="form-section" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Hẹn tái khám</label>
                  <input type="date" className="custom-input" style={{ width: '200px' }} />
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <button className="btn-action secondary" style={{ flex: 1 }}>Lưu nháp</button>
                  <button className="btn-action" style={{ flex: 2 }} onClick={() => alert('Đã lưu bệnh án thành công!')}>
                    Hoàn tất & Lưu bệnh án
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorExam;