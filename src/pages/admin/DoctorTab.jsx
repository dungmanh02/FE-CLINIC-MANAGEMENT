import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorTab = ({ doctors, isLoading, openModal, handleDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="admin-card">
      <div className="card-header">
        <h2><span> 👨‍⚕️ </span> Tài khoản bác sĩ</h2>
        <button className="btn-primary" onClick={() => navigate('/admin/create-doctor')}>+ Thêm bác sĩ</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Đang tìm kiếm dữ liệu trên máy chủ...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Họ tên</th><th>Email</th><th>Chuyên khoa</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {doctors.map(doc => (
                <tr key={doc.id || doc.userId}>
                  <td>{doc.id || doc.userId}</td>
                  <td>{doc.fullName}</td>
                  <td>{doc.email}</td>
                  <td><span className="badge-specialty">{doc.specialization}</span></td>
                  <td className="action-icons">
                    <span className="edit-icon" onClick={() => openModal('doctor', doc)}> ✏️ </span>
                    <span className="delete-icon" onClick={() => handleDelete('doctor', doc.id || doc.userId)}> 🗑️ </span>
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
  );
};
export default DoctorTab;