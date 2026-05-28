import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AppointmentCard = ({ isLoadingAppointments, appointments, setIsModalOpen, openRecordModal, handleViewAppointmentDetails, handleConfirmAppointment, handleCancelAppointment, handleDeleteAppointment, handleViewMedicalRecord, handleViewPatientHistory }) => {
  const [searchRecordId, setSearchRecordId] = useState('');
  // 🚀 STATE TRA CỨU SỔ KHÁM THEO MÃ BỆNH NHÂN
  const [patientHistoryId, setPatientHistoryId] = useState('');

  return (
    <div className="card appointment-card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <h2 className="card-title">Lịch hẹn sắp tới</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            {/* Tra cứu sổ khám bệnh cũ theo ID bệnh nhân */}
            <input type="number" placeholder="Mã ID Bệnh nhân..." value={patientHistoryId} onChange={e => setPatientHistoryId(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #60a5fa', width: '130px', fontSize: '13px' }} />
            <button onClick={() => handleViewPatientHistory(patientHistoryId)} style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Xem Sổ Khám</button>

            {/* Tra cứu bệnh án lẻ */}
            <input type="number" placeholder="ID Bệnh án..." value={searchRecordId} onChange={e => setSearchRecordId(e.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100px', fontSize: '13px' }} />
            <button onClick={() => handleViewMedicalRecord(searchRecordId)} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Tra cứu BA</button>
            
            <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '6px 12px', fontSize: '13px' }}>+ Thêm lịch</button>
        </div>
      </div>
      <div className="appointment-list">
        {isLoadingAppointments ? (
          <p style={{padding: '20px', textAlign: 'center', color: '#64748b'}}>Đang tải dữ liệu lịch hẹn...</p>
        ) : appointments.length > 0 ? (
          appointments.map((appt, index) => (
            <div className="appointment-item status-pending" key={appt.id || index}>
              <img src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${appt.patientId || index}`} alt="Patient" className="patient-avatar" />
              <div className="appointment-details">
                <span className="patient-name">{appt.patientName || `BN mã số: ${appt.patientId}`}</span>
                <span className="appointment-time">{appt.appointmentDate} | {appt.startTime}</span>
              </div>
              <span className={`status-badge ${appt.status === 'PENDING' ? 'pending' : (appt.status === 'CANCELLED' ? 'cancelled' : 'confirmed')}`}>{appt.status || 'Chờ khám'}</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                <button className="btn-action secondary" onClick={() => handleViewAppointmentDetails(appt.id)} style={{ background: '#3b82f6', color: 'white', border: 'none' }}>Chi tiết</button>
                {appt.status === 'PENDING' && <button className="btn-action" onClick={() => handleConfirmAppointment(appt.id)} style={{ background: '#10b981', color: 'white', border: 'none' }}>Xác nhận</button>}
                {appt.status !== 'CANCELLED' && <button className="btn-action" onClick={() => handleCancelAppointment(appt.id)} style={{ background: '#f59e0b', color: 'white', border: 'none' }}>Hủy</button>}
                <button className="btn-action" onClick={() => handleDeleteAppointment(appt.id)} style={{ background: '#ef4444', color: 'white', border: 'none' }}>Xóa</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{padding: '20px', textAlign: 'center', color: '#64748b'}}>Hôm nay bác sĩ chưa có lịch hẹn nào.</div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;