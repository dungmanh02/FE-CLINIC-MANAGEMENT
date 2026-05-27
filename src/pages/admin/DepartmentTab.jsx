import React from 'react';

const DepartmentTab = ({ specialties, isDeptLoading, openModal, handleDelete }) => {
  return (
    <div className="admin-card">
      <div className="card-header">
        <h2><span> 🏥 </span> Danh sách phòng ban</h2>
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
                    <span className="edit-icon" onClick={() => openModal('specialty', spec)}> ✏️ </span>
                    <span className="delete-icon" onClick={() => handleDelete('specialty', spec.id || spec.departmentId)}> 🗑️ </span>
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
  );
};
export default DepartmentTab;