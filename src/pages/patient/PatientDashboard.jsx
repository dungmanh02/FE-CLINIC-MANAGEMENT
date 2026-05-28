import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserAPI } from '../../services/authService';
import { searchDoctorsAPI, getAllDoctorsAPI } from '../../services/adminService';
import { getAllDepartmentsAPI } from '../../services/departmentService';
import { createAppointmentAPI, getAllAppointmentsAPI, getAppointmentDetailsAPI, cancelAppointmentAPI, deleteAppointmentAPI } from '../../services/appointmentService';
import { getAllDrugsAPI, getDrugDetailsAPI } from '../../services/drugService';
import { getMedicalRecordDetailsAPI, getMedicalHistoryByPatientAPI, getPrescriptionsByRecordAPI } from '../../services/medicalRecordService';
import '../../style/base.css';
import '../../style/patient.css';
import Sidebar from './Sidebar';
import Header from './Header';
import AppointmentSection from './AppointmentSection';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiError, setApiError] = useState(false);
  const dropdownRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [isDrugModalOpen, setIsDrugModalOpen] = useState(false);
  const [drugDetails, setDrugDetails] = useState(null);
  const [isDrugDetailModalOpen, setIsDrugDetailModalOpen] = useState(false);

  const [apptDetails, setApptDetails] = useState(null);
  const [isApptDetailModalOpen, setIsApptDetailModalOpen] = useState(false);

  const [recordDetails, setRecordDetails] = useState(null);
  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);

  const [historyRecords, setHistoryRecords] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserAPI();
        setUser(response.data?.data || response.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
      }
    };
    fetchUserData();
  }, []);
  
const fetchAppointmentsAndDepartments = async () => {
    setIsLoadingAppointments(true);
    try {
      // 1. TẢI VÀ SẮP XẾP LỊCH HẸN THEO THỜI GIAN
      const responseAppt = await getAllAppointmentsAPI(0, 100);
      let apptList = Array.isArray(responseAppt.data?.data?.content || responseAppt.data?.data) ? (responseAppt.data?.data?.content || responseAppt.data?.data) : [];

      apptList.sort((a, b) => {
        const dateA = new Date(`${a.appointmentDate}T${a.startTime}`);
        const dateB = new Date(`${b.appointmentDate}T${b.startTime}`);
        return dateA - dateB; 
      });
      setAppointments(apptList);

      // 2. TẢI PHÒNG BAN
      const responseDept = await getAllDepartmentsAPI(0);
      const actualDeptArray = responseDept.data?.data?.departmentResponseList || responseDept.data?.departmentResponseList || responseDept.data?.data?.departments || responseDept.data?.data?.content || responseDept.data?.data || [];
      setDepartments(Array.isArray(actualDeptArray) ? actualDeptArray : []);

      // 3. TẢI DANH MỤC THUỐC
      const responseDrug = await getAllDrugsAPI(0, 100);
      setDrugs(Array.isArray(responseDrug.data?.data?.content || responseDrug.data?.data) ? (responseDrug.data?.data?.content || responseDrug.data?.data) : []);

      // 🚀 4. TRẢ LẠI ĐOẠN TẢI DANH SÁCH BÁC SĨ (Bị thiếu lúc nãy)
      const responseDoc = await getAllDoctorsAPI(0);
      const docs = responseDoc.data?.data?.doctors || responseDoc.data?.data?.doctorList || responseDoc.data?.data?.content || responseDoc.data?.data || responseDoc.data || [];
      setDoctorList(Array.isArray(docs) ? docs : []);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setIsLoadingAppointments(false);
    }
  };
  

  useEffect(() => { fetchAppointmentsAndDepartments(); }, []);
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim() !== '') {
        setIsSearching(true); setShowDropdown(true); setApiError(false);
        try {
          const response = await searchDoctorsAPI(searchTerm);
          setSearchResults(Array.isArray(response.data?.data?.doctors || response.data?.data?.doctorList || response.data?.data?.content || response.data?.data) ? (response.data?.data?.doctors || response.data?.data?.doctorList || response.data?.data?.content || response.data?.data) : []);
        } catch (error) {
          setSearchResults([]); setApiError(true);
        } finally { setIsSearching(false); }
      } else {
        setSearchResults([]); setShowDropdown(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('Đăng xuất khỏi MediPro. Hẹn gặp lại bạn!');
    navigate('/login');
  };
  
  const handleViewDrugDetails = async (id) => {
    try {
      const response = await getDrugDetailsAPI(id);
      setDrugDetails(response.data?.data || response.data);
      setIsDrugDetailModalOpen(true);
    } catch (error) {
      alert("Lỗi khi tải chi tiết thuốc!");
    }
  };
  
  const handleViewAppointmentDetails = async (id) => {
    try {
      const response = await getAppointmentDetailsAPI(id);
      setApptDetails(response.data?.data || response.data);
      setIsApptDetailModalOpen(true);
    } catch (error) {
      alert("Không tìm thấy thông tin chi tiết lịch khám!");
    }
  };
  
  const handleViewMedicalRecord = async (id) => {
    if (!id) return alert("Vui lòng nhập ID Bệnh án!");
    try {
      const [recordRes, prescriptionRes] = await Promise.all([
        getMedicalRecordDetailsAPI(id),
        getPrescriptionsByRecordAPI(id).catch(() => ({ data: { data: [] } }))
      ]);
      const recordData = recordRes.data?.data || recordRes.data;
      const prescriptionData = prescriptionRes.data?.data || prescriptionRes.data || [];

      setRecordDetails({ ...recordData, prescriptionDetails: prescriptionData });
      setIsRecordDetailModalOpen(true);
    } catch (error) {
      alert("Không tìm thấy bệnh án!");
    }
  };
  
  const handleViewOwnHistory = async () => {
    const myId = user?.id || user?.userId;
    if (!myId) return alert("Hệ thống chưa tải xong dữ liệu tài khoản của bạn, vui lòng đợi giây lát!");
    try {
      const response = await getMedicalHistoryByPatientAPI(myId);
      const records = response.data?.data || response.data || [];
      setHistoryRecords(Array.isArray(records) ? records : []);
      setIsHistoryModalOpen(true);
    } catch (error) {
      alert("Không thể tải sổ khám sức khỏe của bạn lúc này!");
    }
  };
  
  const handleCreateAppointment = async () => {
    try {
      // 🚀 SỬA LỖI MẤT TRIỆU CHỨNG: Gửi "rải thảm" nhiều trường để Backend không thể bắt trượt
      const symptomValue = formData.symptoms || "Kiểm tra sức khỏe";
      await createAppointmentAPI({
        patientId: user?.id || user?.userId || 0,
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime.length === 5 ? formData.startTime + ":00" : formData.startTime,
        symptoms: symptomValue,
        symptom: symptomValue,
        reason: symptomValue,
        description: symptomValue
      });
      alert(" 🎉  Đặt lịch hẹn thành công!");
      setIsModalOpen(false);
      setFormData({});
      fetchAppointmentsAndDepartments();
    } catch (error) {
      alert("Đặt lịch thất bại. Vui lòng kiểm tra lại thông tin!");
    }
  };
  
const handleCancelAppointment = async (id) => {
    const reasonText = window.prompt("Lý do hủy lịch:");
    if (reasonText === null) return;
    
    try {
        // Tự động tìm ID bệnh nhân của lịch hẹn này
        const currentAppt = appointments.find(a => a.id === id);
        const pId = currentAppt ? (currentAppt.patientId || currentAppt.userId) : null;

        // Gọi API gửi ID lịch, ID bệnh nhân, lý do và tự động truyền "CANCELLED"
        await cancelAppointmentAPI(id, pId, reasonText);
        
        alert("Đã hủy lịch thành công!");
        fetchAppointmentsAndDepartments(); // Tải lại danh sách
    } catch (error) { 
        alert("Lỗi hủy lịch! Vui lòng kiểm tra lại URL API."); 
    }
  };
  
  const handlePatientDeleteAppointment = async (id) => {
    if (window.confirm(" 🗑 ️ Bạn muốn xóa vĩnh viễn thẻ lịch hẹn này khỏi danh sách hiển thị không?")) {
      try {
        await deleteAppointmentAPI(id);
        alert(" 🗑 ️ Xóa lịch hẹn thành công!");
        fetchAppointmentsAndDepartments();
      } catch (error) {
        alert("Xóa lịch hẹn thất bại. Vui lòng thử lại!");
      }
    }
  };
  
  return (
    <div className="dashboard-container">
      <Sidebar handleLogout={handleLogout} setIsDrugModalOpen={setIsDrugModalOpen} />
      <main className="main-content">
        <Header
          dropdownRef={dropdownRef} searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          showDropdown={showDropdown} setShowDropdown={setShowDropdown}
          isSearching={isSearching} apiError={apiError} searchResults={searchResults} user={user}
        />
        <div className="page-content">
          <h1 className="page-title">Chào mừng {user?.fullName || 'bạn'}, đã sẵn sàng chăm sóc sức khỏe hôm nay?  💙 </h1>
          <p className="page-subtitle">Quản lý lịch hẹn, theo dõi tư vấn và hồ sơ y tế tập trung.</p>
          <div className="patient-dashboard-grid">
            <AppointmentSection
              setIsModalOpen={setIsModalOpen}
              isLoadingAppointments={isLoadingAppointments}
              appointments={appointments}
              handleViewAppointmentDetails={handleViewAppointmentDetails}
              handleCancelAppointment={handleCancelAppointment}
              handlePatientDeleteAppointment={handlePatientDeleteAppointment}
              handleViewMedicalRecord={handleViewMedicalRecord}
              handleViewOwnHistory={handleViewOwnHistory}
            />
          </div>
        </div>
      </main>
      
      {/* 1. Modal Bảng Giá Thuốc */}
      {isDrugModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 12000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}> 💊  Bảng giá thuốc niêm yết</h3>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {drugs.length > 0 ? drugs.map(d => (
                <div key={d.id} style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '16px' }}>{d.name}</strong> - <span style={{ color: '#0f6eff', fontWeight: 'bold' }}>{d.price?.toLocaleString()}đ</span>
                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b' }}>Thành phần/HDSD: {d.ingredient || d.usageInstruction || 'Đang cập nhật'}</p>
                  </div>
                  <button onClick={() => handleViewDrugDetails(d.id)} style={{ padding: '6px 12px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Chi tiết</button>
                </div>
              )) : (
                <p>Chưa có dữ liệu thuốc!</p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsDrugModalOpen(false)} style={{ padding: '8px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 2. Modal Đặt Lịch Khám */}
      {isModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}> ➕  Đặt lịch khám mới</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Vui lòng chọn bác sĩ và thời gian bạn muốn khám.</p>
            <select value={formData.doctorId || ''} onChange={e => setFormData({...formData, doctorId: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} required>
              <option value="" disabled>-- Vui lòng chọn Bác sĩ --</option>
              {doctorList.map(doc => (
                <option key={doc.id || doc.userId} value={doc.id || doc.userId}>
                  BS. {doc.fullName || doc.name} {doc.specialization ? `(${doc.specialization})` : ''}
                </option>
              ))}
            </select>
            <input type="date" value={formData.appointmentDate || ''} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} required />
            <input type="time" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} required />
            <input type="text" placeholder="Triệu chứng/Lý do" value={formData.symptoms || ''} onChange={e => setFormData({...formData, symptoms: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy</button>
              <button onClick={handleCreateAppointment} style={{ padding: '8px 16px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Xác nhận Đặt lịch</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 3. Modal Chi Tiết Lịch Khám */}
      {isApptDetailModalOpen && apptDetails && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 11000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}> 📄  Chi tiết lịch khám #{apptDetails.id}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#334155', textAlign: 'left' }}>
              <p style={{ margin: 0 }}><strong> 👨 ‍ ⚕️  Bác sĩ điều trị:</strong> {apptDetails.doctorName || 'Chưa cập nhật'}</p>
              <p style={{ margin: 0 }}><strong> 👤  Bệnh nhân:</strong> {apptDetails.patientName || 'Chưa cập nhật'}</p>
              <p style={{ margin: 0 }}><strong> 📅  Ngày khám bệnh:</strong> {apptDetails.appointmentDate}</p>
              <p style={{ margin: 0 }}><strong> ⏰  Giờ đăng ký:</strong> {apptDetails.startTime}</p>
              {/* 🚀 QUÉT MỌI TRƯỜNG HỢP TRIỆU CHỨNG TỪ API KHI HIỂN THỊ */}
              <p style={{ margin: 0 }}><strong> ⚠️  Triệu chứng:</strong> {apptDetails?.symptoms || apptDetails?.symptom || apptDetails?.reason || apptDetails?.note || apptDetails?.description || 'Không có ghi chú'}</p>
              <p style={{ margin: 0 }}><strong> 📌  Trạng thái lịch:</strong> <span className={`status-badge ${apptDetails.status === 'PENDING' ?
                'pending' : (apptDetails.status === 'CANCELLED' ? 'cancelled' : 'confirmed')}`}>{apptDetails.status}</span></p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setIsApptDetailModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 4. Modal Xem Chi Tiết Bệnh Án (Lẻ) */}
      {isRecordDetailModalOpen && recordDetails && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 15000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>🩺 Chi tiết Bệnh án #{recordDetails.id}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#334155', textAlign: 'left' }}>
              <p style={{ margin: 0 }}><strong>Mã Lịch hẹn:</strong> #{recordDetails.appointmentID || recordDetails.appointmentId || 'Chưa rõ'}</p>
              <p style={{ margin: 0 }}><strong>Chẩn đoán:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{recordDetails.diagnosis}</span></p>
              <p style={{ margin: 0 }}><strong>Kế hoạch điều trị:</strong> {recordDetails.treatmentPlan || 'Không có ghi chú'}</p>
              <p style={{ margin: 0 }}><strong>Ngày lập:</strong> {recordDetails.createdAt ? new Date(recordDetails.createdAt).toLocaleDateString('vi-VN') : 'Chưa rõ'}</p>
              <p style={{ margin: 0 }}><strong>Ngày hẹn tái khám:</strong> {recordDetails.reexaminationDate || 'Không có hẹn'}</p>
            </div>
            <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '15px', marginTop: '5px', textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0f172a' }}> 💊  Đơn thuốc đính kèm</h4>
              {recordDetails.prescriptionDetails && recordDetails.prescriptionDetails.length > 0 ? (
                <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recordDetails.prescriptionDetails.map((med, idx) => (
                    <li key={idx} style={{ color: '#334155' }}>
                      <strong style={{ color: '#0f6eff' }}>{med.medicineName}</strong> - Số lượng: <strong>{med.quantity}</strong> {med.unit}
                      <br/><span style={{ fontSize: '13px', color: '#64748b' }}>Cách dùng: {med.dosage}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, fontStyle: 'italic', color: '#64748b' }}>Không có đơn thuốc nào được kê.</p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setIsRecordDetailModalOpen(false)} style={{ padding: '8px 20px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 5. Modal Xem Lịch Sử Sổ Khám Bệnh Nhân */}
      {isHistoryModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 16000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '650px', maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#2563eb', borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}> 📒  Sổ Khám Bệnh Điện Tử Của Bạn</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
              {historyRecords.length > 0 ? historyRecords.map((rec) => (
                <div key={rec.id} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}> 🗓 ️ Mã bệnh án: #{rec.id}</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Ngày hẹn tái khám: {rec.reexaminationDate || 'Không có lịch hẹn'}</span>
                  </div>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Bác sĩ kết luận bệnh:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{rec.diagnosis}</span></p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong>Lời dặn & Hướng điều trị:</strong> {rec.treatmentPlan ||
                    'Hãy uống thuốc theo đơn đính kèm.'}</p>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f6eff' }}> 💊  Đơn thuốc bác sĩ bốc:</span>
                    {rec.prescriptionDetails && rec.prescriptionDetails.length > 0 ? (
                      <ul style={{ margin: '5px 0 0 0', paddingLeft: '15px', fontSize: '13px' }}>
                        {rec.prescriptionDetails.map((med, idx) => (
                          <li key={idx}>{med.medicineName} (Số lượng: {med.quantity} viên) - <span style={{color: '#64748b'}}>{med.dosage}</span></li>
                        ))}
                      </ul>
                    ) : <span style={{ fontSize: '13px', fontStyle: 'italic', color: '#94a3b8' }}> Không có đơn thuốc đi kèm.</span>}
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}> 📭  Hồ sơ bệnh án điện tử của bạn hiện chưa có dữ liệu nào trên máy chủ.</div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => { setIsHistoryModalOpen(false); setHistoryRecords([]); }} style={{ padding: '10px 24px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng sổ khám</button>
            </div>
          </div>
        </div>
      )}
      
      {/* 6. Modal Chi Tiết Thuốc */}
      {isDrugDetailModalOpen && drugDetails && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 13000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}> 💊  Thông tin chi tiết thuốc</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#334155', textAlign: 'left' }}>
              <p style={{ margin: 0 }}><strong>Tên thuốc:</strong> <span style={{color: '#0f6eff', fontWeight: 'bold'}}>{drugDetails.name}</span></p>
              <p style={{ margin: 0 }}><strong>Đơn vị tính:</strong> {drugDetails.unit || 'Chưa cập nhật'}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setIsDrugDetailModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;