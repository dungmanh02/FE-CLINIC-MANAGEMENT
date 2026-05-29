import React from 'react';

const PatientTab = ({ patients, isLoading, handleSoftDelete }) => {
  return (
    <div className="admin-card">
      <div className="card-header">
        <h2><span> 👥 </span> Quản lý tài khoản Bệnh nhân</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu bệnh nhân...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Username</th>
                <th>Email</th>
                <th>Giới tính</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(pat => (
                <tr key={pat.id || pat.userId}>
                  <td>#{pat.id || pat.userId}</td>
                  <td>{pat.fullName || pat.name}</td>
                  <td>{pat.username}</td>
                  <td>{pat.email}</td>
                  <td>{pat.gender === 'MALE' ? 'Nam' : (pat.gender === 'FEMALE' ? 'Nữ' : 'Khác')}</td>
                  <td className="action-icons">
                    <button 
                      onClick={() => handleSoftDelete(pat.id || pat.userId)} 
                      style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                    >
                      🗑️ Khóa tài khoản
                    </button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có tài khoản bệnh nhân nào</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientTab;