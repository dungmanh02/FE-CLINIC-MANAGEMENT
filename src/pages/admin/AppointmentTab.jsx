import React, { useState } from 'react';
// Thay đổi import để lấy hàm mới
import { getPatientsByDoctorForAdminAPI, getAllAppointmentsAPI } from '../../services/appointmentService';

const AppointmentTab = ({
  doctors, // Nhận danh sách bác sĩ từ AdminDashboard
  openModal, 
  searchApptId, setSearchApptId, handleViewAppointmentDetails, 
  searchRecordId, setSearchRecordId, handleViewMedicalRecord, 
  searchPatientHistoryId, setSearchPatientHistoryId, handleViewPatientHistory
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  // State cho Modal hiển thị Lịch hẹn của Bệnh nhân
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [patientAppts, setPatientAppts] = useState([]);
  const [isLoadingAppts, setIsLoadingAppts] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');


// 1. CHỌN BÁC SĨ -> TẢI DANH SÁCH BỆNH NHÂN
  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setIsLoadingPatients(true);
    try {
      // 🚀 1. Lấy ID của bác sĩ vừa click
      const doctorId = doctor.id || doctor.userId; 
      
      // 🚀 2. Dùng HÀM MỚI dành riêng cho Admin, truyền ID vào
      const response = await getPatientsByDoctorForAdminAPI(doctorId);
      
      // 🚀 3. Hứng dữ liệu theo đúng cấu trúc Swagger mới
      const allUsers = response.data?.data?.users || response.data?.data?.content || response.data?.data || response.data || [];

      if (Array.isArray(allUsers)) {
        const patientsList = allUsers.filter(u => u.role === 'PATIENT' || u.role === 'ROLE_PATIENT' || u.roleId === 2);
        setPatients(patientsList.length > 0 ? patientsList : allUsers);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setPatients([]);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // 2. CHỌN BỆNH NHÂN -> TẢI DANH SÁCH LỊCH HẸN
  const handleViewAppointments = async (patient) => {
    const patName = patient.fullName || patient.name || patient.username;
    setSelectedPatientName(patName);
    setIsApptModalOpen(true);
    setIsLoadingAppts(true);

    try {
      const responseAppt = await getAllAppointmentsAPI(0, 100);
      let apptList = Array.isArray(responseAppt.data?.data?.content || responseAppt.data?.data) ? (responseAppt.data?.data?.content || responseAppt.data?.data) : [];

      // Sắp xếp thời gian
      apptList.sort((a, b) => new Date(`${a.appointmentDate}T${a.startTime}`) - new Date(`${b.appointmentDate}T${b.startTime}`));

      const docName = selectedDoctor.fullName || selectedDoctor.name || selectedDoctor.username;
      const docId = selectedDoctor.id || selectedDoctor.userId;

      // Lọc lịch hẹn của đúng Bác sĩ và đúng Bệnh nhân này
      const filteredAppts = apptList.filter(a =>
        (a.doctorName === docName || a.doctorId === docId) &&
        (a.patientName === patName)
      );
      setPatientAppts(filteredAppts);
    } catch (error) {
      console.error("Lỗi lấy lịch hẹn:", error);
    } finally {
      setIsLoadingAppts(false);
    }
  };

  return (
    <div>
      {/* 🚀 PHẦN 1: GIỮ NGUYÊN HOÀN TOÀN GIAO DIỆN CŨ CỦA BẠN */}
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
            {/* Tra cứu lịch sử bệnh án */}
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '420px', background: '#eff6ff', padding: '15px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <input type="number" placeholder="Nhập ID Bệnh nhân cần xem sổ khám..." value={searchPatientHistoryId} onChange={(e) => setSearchPatientHistoryId(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #60a5fa', flex: 1, fontSize: '14px' }} />
              <button className="btn-primary" onClick={() => handleViewPatientHistory(searchPatientHistoryId)} style={{ padding: '10px 20px', whiteSpace: 'nowrap', backgroundColor: '#2563eb', border: 'none' }}>Xem Lịch sử khám</button>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 PHẦN 2: TÍNH NĂNG MỚI - CHỌN BÁC SĨ & BỆNH NHÂN */}
      <div style={{ marginTop: '20px' }}>
        {!selectedDoctor ? (
          <div className="admin-card">
            <div className="card-header" style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
              <h2><span>👨‍⚕️</span> Chọn Bác sĩ để rà soát Bệnh nhân</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', padding: '20px' }}>
              {doctors && doctors.map(doc => (
                <div key={doc.id || doc.userId} onClick={() => handleSelectDoctor(doc)} style={{ padding: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'center' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>🩺</div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>BS. {doc.fullName || doc.name || doc.username}</h4>
                  <span style={{ fontSize: '13px', color: '#64748b', backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '12px' }}>{doc.specialization || 'Chưa cập nhật khoa'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-card" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2><span>👥</span> Bệnh nhân của BS. {selectedDoctor.fullName || selectedDoctor.name}</h2>
              <button onClick={() => setSelectedDoctor(null)} style={{ padding: '6px 12px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>⬅ Quay lại danh sách Bác sĩ</button>
            </div>
            {isLoadingPatients ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải danh sách...</p>
            ) : (
            
        <div className="table-responsive" style={{ padding: '0 20px 20px 20px', width: '100%' }}>
          <table className="admin-table" style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '14px 15px', width: '10%', textAlign: 'center', color: '#475569' }}>ID</th>
                <th style={{ padding: '14px 15px', width: '30%', color: '#475569' }}>Họ và Tên</th>
                <th style={{ padding: '14px 15px', width: '30%', color: '#475569' }}>Email / SĐT</th>
                <th style={{ padding: '14px 15px', width: '30%', textAlign: 'center', color: '#475569' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? patients.map((patient, index) => (
                <tr key={patient.id || patient.userId || patient.patientId || index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '16px 15px', textAlign: 'center', color: '#64748b', fontWeight: '500' }}>#{patient.id || patient.userId || patient.patientId}</td>
                  <td style={{ padding: '16px 15px' }}>
                    <strong style={{ color: '#0f172a', fontSize: '15px' }}>{patient.name || patient.fullName || patient.username}</strong>
                  </td>
                  <td style={{ padding: '16px 15px', color: '#334155' }}>
                    {patient.email || patient.phone || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa cập nhật</span>}
                  </td>
                  <td style={{ padding: '16px 15px' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => handleViewAppointments(patient)} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}>
                        📅 Lịch hẹn
                      </button>
                      <button onClick={() => {
                          setSearchPatientHistoryId(patient.id || patient.userId || patient.patientId);
                          handleViewPatientHistory(patient.id || patient.userId || patient.patientId);
                      }} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}>
                        📜 Sổ bệnh án
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>📭 Bác sĩ này hiện chưa có bệnh nhân nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
            )}
          </div>
        )}
      </div>

      {/* 🚀 MODAL HIỂN THỊ DANH SÁCH LỊCH HẸN TRỰC TIẾP TỪ NÚT BẤM */}
      {isApptModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 13000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '700px', maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', margin: '0 0 15px 0' }}>📋 Lịch hẹn giữa BS. {selectedDoctor.fullName || selectedDoctor.name} và Bệnh nhân {selectedPatientName}</h3>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {isLoadingAppts ? (
                <p style={{ textAlign: 'center' }}>Đang tải lịch hẹn...</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Giờ</th>
                      <th>Triệu chứng</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientAppts.length > 0 ? patientAppts.map(appt => (
                      <tr key={appt.id}>
                        <td>{appt.appointmentDate}</td>
                        <td>{appt.startTime}</td>
                        <td>{appt.symptoms || appt.reason || appt.description || 'Không ghi chú'}</td>
                        <td>
                          <span className={`status-badge ${appt.status === 'PENDING' ? 'status-pending' : (appt.status === 'CANCELLED' ? 'status-cancelled' : 'status-confirmed')}`}>
                            {appt.status === 'PENDING' ? 'Chờ xác nhận' : appt.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đã hủy'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Không có lịch hẹn nào giữa 2 người này.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
              <button onClick={() => setIsApptModalOpen(false)} style={{ padding: '8px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentTab;