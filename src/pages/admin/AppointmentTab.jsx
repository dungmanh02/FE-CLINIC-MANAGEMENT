import React from 'react';

const AppointmentTab = ({ openModal, searchApptId, setSearchApptId, handleViewAppointmentDetails, searchRecordId, setSearchRecordId, handleViewMedicalRecord, searchPatientHistoryId, setSearchPatientHistoryId, handleViewPatientHistory }) => {
  return (
    <div className="admin-card">
      <div className="card-header">
        <h2><span> 📅 </span> Quản lý Lịch hẹn & Bệnh án</h2>
        <button className="btn-primary" onClick={() => openModal('appointment')}>+ Đặt lịch hộ Bệnh nhân</button>
      </div>
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <p style={{ fontSize: '16px', fontWeight: '500' }}>Tra cứu chi tiết Lịch hẹn, Bệnh án & Lịch sử khám bệnh</p>
        <p style={{ fontSize: '13px', marginBottom: '25px' }}>Nhập mã ID tương ứng hệ thống để tra cứu thông tin nhanh.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            {/* Tra cứu lịch hẹn */}
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '420px', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <input type="number" placeholder="Nhập ID lịch hẹn..." value={searchApptId} onChange={(e) => setSearchApptId(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', flex: 1, fontSize: '14px' }} />
              <button className="btn-primary" onClick={() => handleViewAppointmentDetails(searchApptId)} style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>Xem Lịch hẹn</button>
            </div>

            {/* Tra cứu 1 bệnh án chi tiết */}
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '420px', background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <input type="number" placeholder="Nhập ID bệnh án lẻ..." value={searchRecordId} onChange={(e) => setSearchRecordId(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #86efac', flex: 1, fontSize: '14px' }} />
              <button className="btn-primary" onClick={() => handleViewMedicalRecord(searchRecordId)} style={{ padding: '10px 20px', whiteSpace: 'nowrap', backgroundColor: '#16a34a', border: 'none' }}>Xem Bệnh án</button>
            </div>

            {/* 🚀 THANH MỚI: Tra cứu lịch sử bệnh án của cả một Bệnh nhân */}
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '420px', background: '#eff6ff', padding: '15px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <input type="number" placeholder="Nhập ID Bệnh nhân cần xem sổ khám..." value={searchPatientHistoryId} onChange={(e) => setSearchPatientHistoryId(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #60a5fa', flex: 1, fontSize: '14px' }} />
              <button className="btn-primary" onClick={() => handleViewPatientHistory(searchPatientHistoryId)} style={{ padding: '10px 20px', whiteSpace: 'nowrap', backgroundColor: '#2563eb', border: 'none' }}>Xem Lịch sử khám</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentTab;