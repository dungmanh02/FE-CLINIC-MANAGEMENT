import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AppointmentSection = ({ setIsModalOpen, isLoadingAppointments, appointments, handleViewAppointmentDetails, handleCancelAppointment, handlePatientDeleteAppointment, handleViewMedicalRecord, handleViewOwnHistory }) => {
  const [searchRecordId, setSearchRecordId] = useState('');

  return (
    <div className="appointments-section">
      <div className="section-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <h2>Lịch hẹn của bạn</h2>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* 🚀 NÚT MỚI: Cho phép Bệnh nhân bấm xem tất cả bệnh án cũ của CHÍNH MÌNH */}
          <button onClick={handleViewOwnHistory} style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>📜 Lịch sử bệnh án</button>

          {/* Ô tìm bệnh án lẻ */}
          <input type="number" placeholder="Mã số Bệnh án..." value={searchRecordId} onChange={e => setSearchRecordId(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '120px', fontSize: '14px' }} />
          <button onClick={() => handleViewMedicalRecord(searchRecordId)} style={{ padding: '#10b981', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '8px 16px' }}>Xem BA</button>
          
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Đặt lịch nhanh</button>
        </div>
      </div>
      <div className="appointment-list">
        {isLoadingAppointments ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu lịch hẹn...</p>
        ) : appointments.length > 0 ? (
          appointments.map((appt, index) => (
            <div className="appointment-card" key={appt.id || index}>
              <div className="doctor-info">
                <img src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${appt.doctorId || 'DrHa'}&backgroundColor=0f6eff`} className="doctor-avatar" alt="Doctor" />
                <div className="doctor-details">
                  <h4>BS. {appt.doctorName || `Mã BS: ${appt.doctorId}`}</h4>
                  <span className="doctor-specialty">{appt.departmentName || 'Chuyên khoa'}</span>
                </div>
              </div>
              <div className="appointment-meta">
                <span className="appointment-time"> ⏰ {appt.appointmentDate} | {appt.startTime}</span>
                <span className={`status-badge ${appt.status === 'PENDING' ? 'pending' : (appt.status === 'CANCELLED' ? 'cancelled' : 'confirmed')}`}>{appt.status || 'Đang diễn ra'}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-primary" onClick={() => handleViewAppointmentDetails(appt.id)} style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px' }}>Chi tiết</button>
                {appt.status !== 'CANCELLED' && (
                  <button className="btn-cancel" onClick={() => handleCancelAppointment(appt.id)}>Hủy lịch</button>
                )}
                <button className="btn-cancel" onClick={() => handlePatientDeleteAppointment(appt.id)} style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}>Xóa</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
            <p>Bạn chưa có lịch hẹn nào. Hãy ấn <strong>+ Đặt lịch nhanh</strong> để bắt đầu!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSection;