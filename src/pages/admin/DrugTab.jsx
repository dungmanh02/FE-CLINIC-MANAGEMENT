import React from 'react';

const DrugTab = ({ drugs, isDrugLoading, openModal, handleViewDrugDetails, handleDelete }) => {
  return (
    <div className="admin-card">
      <div className="card-header">
        <h2><span> 💊 </span> Kho thuốc & dược phẩm</h2>
        <button className="btn-primary" onClick={() => openModal('drug')}>+ Thêm thuốc</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead><tr><th>ID</th><th>Tên thuốc</th><th>Hoạt chất / HDSD</th><th>Đơn vị</th><th>Giá (VNĐ)</th><th>Thao tác</th></tr></thead>
          <tbody>
            {isDrugLoading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu thuốc...</td></tr>
            ) : drugs.length > 0 ? (
              drugs.map(d => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td><strong>{d.name}</strong></td>
                  <td style={{maxWidth: '250px', color: '#64748b'}}>{d.ingredient || d.usageInstruction || 'Chưa cập nhật'}</td>
                  <td>{d.unit || 'Viên'}</td>
                  <td style={{color: '#0f6eff', fontWeight: 'bold'}}>{d.price ? d.price.toLocaleString() + ' VNĐ' : '0 VNĐ'}</td>
                  <td className="action-icons">
                    <span className="view-icon" onClick={() => handleViewDrugDetails(d.id)} style={{cursor: 'pointer', marginRight: '8px'}}> 👁️ </span>
                    <span className="edit-icon" onClick={() => openModal('drug', d)}> ✏️ </span>
                    <span className="delete-icon" onClick={() => handleDelete('drug', d.id)}> 🗑️ </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có dữ liệu thuốc trong hệ thống.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DrugTab;