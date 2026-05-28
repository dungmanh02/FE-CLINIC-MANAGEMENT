import React from 'react';

const DepartmentTab = ({ specialties, isDeptLoading, openModal, handleDelete }) => {
  return (
    <div className="admin-card">
      <div className="card-header">
        <h2><span>🏥</span> Danh sách phòng ban</h2>
        <button className="btn-primary" onClick={() => openModal('specialty')}>+ Thêm phòng ban</button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên phòng ban</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isDeptLoading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                  ⏳ Đang tải dữ liệu từ máy chủ...
                </td>
              </tr>
            ) : specialties.length > 0 ? (
              specialties.map((dept, index) => (
                <tr key={dept.id || index}>
                  <td>{dept.id}</td>
                  
                  <td>
                    <span className="badge-specialty">{dept.name}</span>
                  </td>
                  
                  <td>{dept.description || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có mô tả</span>}</td>
                  
                  {/* 🚀 ĐÃ NÂNG CẤP GIAO DIỆN NÚT BẤM: Có màu, bo góc, căn lề chuẩn chỉnh */}
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => openModal('specialty', dept)}
                        style={{ 
                          padding: '6px 14px', 
                          backgroundColor: '#3b82f6', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px'
                        }}
                      >
                        SỬA
                      </button>
                      <button 
                        onClick={() => handleDelete('specialty', dept.id)}
                        style={{ 
                          padding: '6px 14px', 
                          backgroundColor: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '13px'
                        }}
                      >
                        XÓA
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                  Không có dữ liệu phòng ban nào!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentTab;