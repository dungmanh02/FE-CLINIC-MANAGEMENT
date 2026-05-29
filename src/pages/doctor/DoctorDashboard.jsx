import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUserAPI } from '../../services/authService';
import { getAllDepartmentsAPI } from '../../services/departmentService';
import { createAppointmentAPI, getAllAppointmentsAPI, getAppointmentDetailsAPI, confirmAppointmentAPI, cancelAppointmentAPI, deleteAppointmentAPI } from '../../services/appointmentService';
import { getAllDrugsAPI, getDrugDetailsAPI } from '../../services/drugService';
import { createMedicalRecordAPI, getMedicalRecordDetailsAPI, getMedicalHistoryByPatientAPI, addMedicinesToRecordAPI, getPrescriptionsByRecordAPI } from '../../services/medicalRecordService';
import { getPatientsByDoctorAPI } from '../../services/appointmentService'; 

import '../../style/base.css';
import '../../style/components.css';
import '../../style/doctor.css';
import Sidebar from './Sidebar';
import Header from './Header';
import StatCards from './StatCards';
import AppointmentCard from './AppointmentCard';
import TrendCard from './TrendCard';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [drugs, setDrugs] = useState([]);
  
  const [patients, setPatients] = useState([]);
  const [isPatientApptModalOpen, setIsPatientApptModalOpen] = useState(false);
  const [selectedPatientForAppt, setSelectedPatientForAppt] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrugModalOpen, setIsDrugModalOpen] = useState(false);
  const [drugDetails, setDrugDetails] = useState(null);
  const [isDrugDetailModalOpen, setIsDrugDetailModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [apptDetails, setApptDetails] = useState(null);
  const [isApptDetailModalOpen, setIsApptDetailModalOpen] = useState(false);
  
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordForm, setRecordForm] = useState({ appointmentId: '', diagnosis: '', treatmentPlan: '', reexaminationDate: '', medicines: [] });
  const [recordDetails, setRecordDetails] = useState(null);
  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);

  const [historyRecords, setHistoryRecords] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [currentSelectedPatientId, setCurrentSelectedPatientId] = useState('');

  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [newMedicines, setNewMedicines] = useState([{ medicineId: '', quantity: 1, dosage: '' }]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserAPI();
        const userData = response.data?.data || response.data;
        setUser(userData);
        
        // 🚨 IN DỮ LIỆU USER RA ĐỂ TÓM GỌN TÊN BIẾN
        console.log("🚨 KIỂM TRA DỮ LIỆU USER ĐĂNG NHẬP:", userData);
        
        // 🚀 LƯỚI LỌC ID 5 LỚP (Bắt mọi trường hợp Backend có thể giấu ID)
        const docId = userData?.id || userData?.userId || userData?.doctorId || userData?.user?.id || userData?.doctor?.id;
        
        if (docId && docId !== 'undefined') {
          fetchPatients(docId);
        } else {
          console.error("❌ LỖI: Không tìm thấy ID của Bác sĩ! Hãy bấm vào cái Log 🚨 ở trên để xem Backend đang trả về tên biến là gì!");
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin User:", error);
      }
    };
    fetchUserData();
  }, []);

const fetchPatients = async (doctorId) => {
    try {
      // Gọi API lấy toàn bộ Users theo đường dẫn mới
      const response = await getPatientsByDoctorAPI(doctorId);
      
      // Bắt vào cái mảng "users" theo đúng như ảnh Swagger bạn chụp
      const allUsers = response.data?.data?.users || response.data?.users || [];
      
      // Lọc ra CHỈ NHỮNG NGƯỜI CÓ ROLE LÀ PATIENT
      const onlyPatients = allUsers.filter(user => user.role === 'PATIENT');
        
      setPatients(onlyPatients);
    } catch (error) {
      console.error("Lỗi lấy danh sách bệnh nhân:", error);
    }
  };

  const fetchAppointmentsAndDepartments = async () => {
    setIsLoadingAppointments(true);
    try {
      const responseAppt = await getAllAppointmentsAPI(0, 100);
      setAppointments(Array.isArray(responseAppt.data?.data?.content || responseAppt.data?.data) ? (responseAppt.data?.data?.content || responseAppt.data?.data) : []);

      const responseDept = await getAllDepartmentsAPI(0);
      const actualDeptArray = responseDept.data?.data?.departmentResponseList || responseDept.data?.departmentResponseList || responseDept.data?.data?.departments || responseDept.data?.data?.content || responseDept.data?.data || [];
      setDepartments(Array.isArray(actualDeptArray) ? actualDeptArray : []);

      const responseDrug = await getAllDrugsAPI(0, 100);
      setDrugs(Array.isArray(responseDrug.data?.data?.content || responseDrug.data?.data) ? (responseDrug.data?.data?.content || responseDrug.data?.data) : []);
    } catch (error) {
      console.error("Lỗi fetch dữ liệu:", error);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  useEffect(() => { fetchAppointmentsAndDepartments(); }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleViewDrugDetails = async (id) => {
    try {
      const response = await getDrugDetailsAPI(id);
      setDrugDetails(response.data?.data || response.data);
      setIsDrugDetailModalOpen(true);
    } catch (error) { alert("Lỗi khi tải chi tiết thuốc!"); }
  };

  const handleViewAppointmentDetails = async (id) => {
    try {
      const response = await getAppointmentDetailsAPI(id);
      setApptDetails(response.data?.data || response.data);
      setIsApptDetailModalOpen(true);
    } catch (error) { alert("Không tìm thấy thông tin chi tiết!"); }
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
    } catch (error) { alert("Không tìm thấy bệnh án!"); }
  };

  const handleViewPatientHistory = async (patientId) => {
    if (!patientId) return alert("Vui lòng cung cấp mã ID Bệnh nhân!");
    try {
      const response = await getMedicalHistoryByPatientAPI(patientId);
      const records = response.data?.data || response.data || [];
      setHistoryRecords(Array.isArray(records) ? records : []);
      setCurrentSelectedPatientId(patientId);
      setIsHistoryModalOpen(true);
    } catch (error) { alert("Lỗi kết nối hoặc không tìm thấy dữ liệu bệnh nhân này!"); }
  };

  const handleCreateAppointment = async () => {
    try {
      const symptomValue = formData.symptoms || "Tái khám";
      // 🚀 NÂNG CẤP LẤY ID BÁC SĨ TẠI ĐÂY LUN ĐỂ TRÁNH LỖI ĐẶT LỊCH
      const safeDoctorId = user?.id || user?.userId || user?.doctorId || user?.user?.id || user?.doctor?.id || 0;
      
      await createAppointmentAPI({
        patientId: parseInt(formData.patientId),
        doctorId: safeDoctorId,
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime.length === 5 ? formData.startTime + ":00" : formData.startTime,
        symptoms: symptomValue, reason: symptomValue, description: symptomValue
      });
      alert("Tạo lịch hẹn thành công!");
      setIsModalOpen(false);
      setFormData({});
      fetchAppointmentsAndDepartments();
    } catch (error) { alert("Tạo lịch thất bại!"); }
  };

const handleConfirmAppointment = async (id) => {
    if (window.confirm("Xác nhận lịch hẹn này?")) {
      try {
        // Tự động tìm ID bệnh nhân của lịch hẹn này
        const currentAppt = appointments.find(a => a.id === id);
        const pId = currentAppt ? (currentAppt.patientId || currentAppt.userId) : null;
        
        // Gọi API gửi ID lịch, ID bệnh nhân và tự động truyền "CONFIRMED" (Bên service đã làm)
        await confirmAppointmentAPI(id, pId);
        
        alert("Đã xác nhận thành công! Bạn có thể sang mục Bệnh nhân để tiến hành khám.");
        fetchAppointmentsAndDepartments(); // Tải lại danh sách
      } catch (error) { 
        alert("Lỗi xác nhận! Vui lòng kiểm tra lại URL API."); 
      }
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

  const handleDeleteAppointment = async (id) => {
    if (window.confirm(`Xóa hẳn cuộc hẹn #${id}?`)) {
      try {
        await deleteAppointmentAPI(id);
        alert("Đã xóa!");
        fetchAppointmentsAndDepartments();
      } catch (error) { alert("Lỗi xóa!"); }
    }
  };

  const openPatientAppointmentsModal = (patient) => {
    setSelectedPatientForAppt(patient);
    setIsPatientApptModalOpen(true);
  };

  const openRecordModal = (appointmentId) => {
    setRecordForm({
      appointmentId: appointmentId, diagnosis: '', treatmentPlan: '', reexaminationDate: '',
      medicines: [{ medicineId: drugs.length > 0 ? drugs[0].id : '', quantity: 1, dosage: '' }]
    });
    setIsRecordModalOpen(true);
  };

  const handleAddMedicineToRecord = () => {
    setRecordForm({ ...recordForm, medicines: [...recordForm.medicines, { medicineId: drugs.length > 0 ? drugs[0].id : '', quantity: 1, dosage: '' }] });
  };
  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...recordForm.medicines];
    newMedicines[index][field] = value;
    setRecordForm({ ...recordForm, medicines: newMedicines });
  };
  const handleRemoveMedicine = (index) => {
    const newMedicines = recordForm.medicines.filter((_, i) => i !== index);
    setRecordForm({ ...recordForm, medicines: newMedicines });
  };
  
  const handleSaveMedicalRecord = async () => {
    try {
      const payload = {
        appointmentId: parseInt(recordForm.appointmentId), diagnosis: recordForm.diagnosis, treatmentPlan: recordForm.treatmentPlan, reexaminationDate: recordForm.reexaminationDate || null,
        medicines: recordForm.medicines.map(m => ({ medicineId: parseInt(m.medicineId), quantity: parseInt(m.quantity), dosage: m.dosage }))
      };
      await createMedicalRecordAPI(payload);
      alert("Đã lập bệnh án và kê đơn thành công!");
      setIsRecordModalOpen(false);
      fetchAppointmentsAndDepartments(); 
    } catch (error) { alert("Lập bệnh án thất bại!"); }
  };

  const handleAddMoreMedicineRow = () => { setNewMedicines([...newMedicines, { medicineId: '', quantity: 1, dosage: '' }]); };
  const handleNewMedicineChange = (index, field, value) => { const updated = [...newMedicines]; updated[index][field] = value; setNewMedicines(updated); };
  const handleRemoveNewMedicine = (index) => { const updated = newMedicines.filter((_, i) => i !== index); setNewMedicines(updated); };
  
  const submitAdditionalMedicines = async () => {
    const isValid = newMedicines.every(m => m.medicineId && m.quantity > 0 && m.dosage);
    if (!isValid) return alert("Vui lòng nhập đầy đủ thông tin thuốc bổ sung!");
    try {
      const payload = newMedicines.map(m => ({ medicineId: parseInt(m.medicineId), quantity: parseInt(m.quantity), dosage: m.dosage }));
      await addMedicinesToRecordAPI(recordDetails.id, payload);
      alert("✅ Đã bổ sung thuốc vào bệnh án thành công!");

      const [recordRes, prescriptionRes] = await Promise.all([
        getMedicalRecordDetailsAPI(recordDetails.id),
        getPrescriptionsByRecordAPI(recordDetails.id).catch(() => ({ data: { data: [] } }))
      ]);
      const recordData = recordRes.data?.data || recordRes.data;
      const prescriptionData = prescriptionRes.data?.data || prescriptionRes.data || [];
      setRecordDetails({ ...recordData, prescriptionDetails: prescriptionData });

      setShowAddMedicineForm(false);
      setNewMedicines([{ medicineId: '', quantity: 1, dosage: '' }]);
    } catch (error) { alert("Lỗi khi bổ sung thuốc!"); }
  };

  return (
    <div className="dashboard-container">
      <Sidebar handleLogout={handleLogout} setIsDrugModalOpen={setIsDrugModalOpen} setIsDeptModalOpen={setIsDeptModalOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <Header user={user} />
        <div className="page-content">
          <h1 className="page-title">Chào buổi sáng, BS. {user?.fullName?.split(' ').pop() || ''}!</h1>
          
          {activeTab === 'dashboard' && (
            <>
              <p className="page-subtitle">Dưới đây là tổng quan lịch làm việc hôm nay của bạn.</p>
              <div className="bento-grid">
                <StatCards appointmentsCount={appointments.length || 18} />
                <AppointmentCard
                  isLoadingAppointments={isLoadingAppointments}
                  appointments={appointments}
                  setIsModalOpen={setIsModalOpen}
                  openRecordModal={() => alert("📌 Theo quy trình mới: Vui lòng chuyển sang tab 'Bệnh nhân', chọn bệnh nhân và ấn 'Lập bệnh án' từ các lịch hẹn đã xác nhận!")}
                  handleViewAppointmentDetails={handleViewAppointmentDetails}
                  handleConfirmAppointment={handleConfirmAppointment}
                  handleCancelAppointment={handleCancelAppointment}
                  handleDeleteAppointment={handleDeleteAppointment}
                  handleViewMedicalRecord={handleViewMedicalRecord}
                  handleViewPatientHistory={handleViewPatientHistory}
                />
                <TrendCard />
              </div>
            </>
          )}

          {activeTab === 'patients' && (
            <div className="admin-card" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
              <div className="card-header">
                <h2><span>👥</span> Bệnh nhân của tôi</h2>
              </div>
              <div className="table-responsive" style={{ padding: '0 20px 20px 20px' }}>
                <table className="admin-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 15px', width: '10%', textAlign: 'center', color: '#475569' }}>ID</th>
                      <th style={{ padding: '12px 15px', width: '15%', color: '#475569' }}>Mã BN</th>
                      <th style={{ padding: '12px 15px', width: '25%', color: '#475569' }}>Họ và Tên</th>
                      <th style={{ padding: '12px 15px', width: '25%', color: '#475569' }}>Email</th>
                      <th style={{ padding: '12px 15px', width: '25%', textAlign: 'center', color: '#475569' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.length > 0 ? patients.map((patient, index) => (
                      <tr key={patient.id || patient.userId || patient.patientId || index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td style={{ padding: '16px 15px', textAlign: 'center', color: '#64748b', fontWeight: '500' }}>#{patient.id || patient.userId || patient.patientId}</td>
                        <td style={{ padding: '16px 15px', color: '#334155' }}>
                          {patient.code || patient.patientCode || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có mã</span>}
                        </td>
                        <td style={{ padding: '16px 15px' }}>
                          <strong style={{ color: '#0f172a', fontSize: '15px' }}>{patient.name || patient.fullName || patient.patientName || patient.username}</strong>
                        </td>
                        <td style={{ padding: '16px 15px', color: '#334155' }}>
                          {patient.email || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa cập nhật</span>}
                        </td>
                        <td style={{ padding: '16px 15px' }}>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => openPatientAppointmentsModal(patient)}
                              style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)' }}
                            >
                              🏥 Lịch hẹn & Khám
                            </button>
                            <button 
                              onClick={() => handleViewPatientHistory(patient.id || patient.userId || patient.patientId)}
                              style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}
                            >
                              📜 Sổ bệnh án
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                          📭 Hiện chưa có bệnh nhân nào trong danh sách của bạn.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CÁC MODAL HIỂN THỊ */}
      {isDrugModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 12000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>💊 Danh mục thuốc hệ thống</h3>
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

      {isModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a' }}>➕ Tạo lịch cho Bệnh nhân</h3>
            <input type="number" placeholder="Nhập ID Bệnh nhân *" value={formData.patientId || ''} onChange={e => setFormData({...formData, patientId: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} required />
            <input type="date" value={formData.appointmentDate || ''} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} required />
            <input type="time" value={formData.startTime || ''} onChange={e => setFormData({...formData, startTime: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} required />
            <input type="text" placeholder="Triệu chứng/Lý do" value={formData.symptoms || ''} onChange={e => setFormData({...formData, symptoms: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleCreateAppointment} style={{ padding: '8px 16px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {isApptDetailModalOpen && apptDetails && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 11000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>📄 Chi tiết cuộc hẹn #{apptDetails.id}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#334155', textAlign: 'left' }}>
              <p style={{ margin: 0 }}><strong>👤 Bệnh nhân:</strong> {apptDetails.patientName || 'Chưa cập nhật'}</p>
              <p style={{ margin: 0 }}><strong>👨‍⚕️ Bác sĩ:</strong> {apptDetails.doctorName || 'Chưa cập nhật'}</p>
              <p style={{ margin: 0 }}><strong>📅 Ngày đặt lịch:</strong> {apptDetails.appointmentDate}</p>
              <p style={{ margin: 0 }}><strong>⏰ Khung giờ khám:</strong> {apptDetails.startTime}</p>
              <p style={{ margin: 0 }}><strong>📌 Triệu chứng:</strong> {apptDetails.symptom || apptDetails.symptoms || apptDetails.reason || apptDetails.description || 'Không có ghi chú'}</p>
              <p style={{ margin: 0 }}><strong>📌 Trạng thái:</strong> {apptDetails.status}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setIsApptDetailModalOpen(false)} style={{padding: '8px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}

      {isRecordModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 14000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '600px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>🩺 Lập bệnh án & Kê đơn</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>👤 Bệnh nhân:</strong> {apptDetails?.patientName || 'Chưa rõ'}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#ef4444' }}><strong>⚠️ Triệu chứng:</strong> {apptDetails?.symptom || apptDetails?.symptoms || apptDetails?.reason || apptDetails?.description || 'Bệnh nhân không ghi chú triệu chứng.'}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Chẩn đoán bệnh *" value={recordForm.diagnosis} onChange={e => setRecordForm({...recordForm, diagnosis: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}} required />
              <textarea placeholder="Kế hoạch điều trị / Lời dặn" value={recordForm.treatmentPlan} onChange={e => setRecordForm({...recordForm, treatmentPlan: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '60px'}} />
              <div>
                <label style={{ fontSize: '13px', color: '#64748b' }}>Ngày tái khám:</label>
                <input type="date" value={recordForm.reexaminationDate} onChange={e => setRecordForm({...recordForm, reexaminationDate: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box'}} />
              </div>
              <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '10px', marginTop: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ color: '#0f172a' }}>💊 Đơn thuốc</strong>
                  <button onClick={handleAddMedicineToRecord} style={{ padding: '4px 10px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>+ Thêm thuốc</button>
                </div>
                {recordForm.medicines.map((med, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                    <select value={med.medicineId} onChange={e => handleMedicineChange(index, 'medicineId', e.target.value)} style={{ flex: 2, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="">-- Chọn thuốc --</option>
                      {drugs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.unit})</option>)}
                    </select>
                    <input type="number" placeholder="SL" value={med.quantity} onChange={e => handleMedicineChange(index, 'quantity', e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} min="1" />
                    <input type="text" placeholder="Liều dùng" value={med.dosage} onChange={e => handleMedicineChange(index, 'dosage', e.target.value)} style={{ flex: 2, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    {recordForm.medicines.length > 1 && (
                      <button onClick={() => handleRemoveMedicine(index)} style={{ padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>X</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '10px' }}>
              <button onClick={() => setIsRecordModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy</button>
              <button onClick={handleSaveMedicalRecord} style={{ padding: '8px 16px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Bệnh Án</button>
            </div>
          </div>
        </div>
      )}

      {isRecordDetailModalOpen && recordDetails && (
        <div className="modal" style={{ display: 'flex', zIndex: 15000 }}>
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>🩺 Chi tiết Bệnh án #{recordDetails.id}</h3>
            <div style={{ textAlign: 'left', margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#334155' }}>
              <p style={{ margin: 0 }}><strong>Mã Lịch hẹn:</strong> #{recordDetails.appointmentID || recordDetails.appointmentId || 'Chưa rõ'}</p>
              <p style={{ margin: 0 }}><strong>Chẩn đoán:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{recordDetails.diagnosis}</span></p>
              <p style={{ margin: 0 }}><strong>Kế hoạch điều trị:</strong> {recordDetails.treatmentPlan || 'Không có ghi chú'}</p>
              <p style={{ margin: 0 }}><strong>Ngày hẹn tái khám:</strong> {recordDetails.reexaminationDate || 'Không có hẹn'}</p>
            </div>
            <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '15px', marginTop: '5px', textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>💊 Đơn thuốc hiện tại</h4>
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
                <p style={{ margin: 0, fontStyle: 'italic', color: '#64748b' }}>Không có đơn thuốc nào được kê ban đầu.</p>
              )}
            </div>
            <div style={{ marginTop: '20px', borderTop: '2px solid #e2e8f0', paddingTop: '15px', textAlign: 'left' }}>
              {!showAddMedicineForm ? (
                <button onClick={() => setShowAddMedicineForm(true)} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', width: '100%' }}>+ Kê thêm thuốc vào Bệnh án này</button>
              ) : (
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <h5 style={{ margin: '0 0 10px 0', color: '#0f6eff', fontSize: '14px' }}>📝 Nhập thuốc bổ sung</h5>
                  {newMedicines.map((med, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                      <select value={med.medicineId} onChange={e => handleNewMedicineChange(index, 'medicineId', e.target.value)} style={{ flex: 2, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <option value="">-- Chọn thuốc --</option>
                        {drugs.map(d => <option key={d.id} value={d.id}>{d.name} ({d.unit})</option>)}
                      </select>
                      <input type="number" placeholder="SL" value={med.quantity} onChange={e => handleNewMedicineChange(index, 'quantity', e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} min="1" />
                      <input type="text" placeholder="Liều dùng" value={med.dosage} onChange={e => handleNewMedicineChange(index, 'dosage', e.target.value)} style={{ flex: 2, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      {newMedicines.length > 1 && (
                        <button onClick={() => handleRemoveNewMedicine(index)} style={{ padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>X</button>
                      )}
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                    <button onClick={handleAddMoreMedicineRow} style={{ padding: '6px 12px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>+ Thêm dòng</button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => { setShowAddMedicineForm(false); setNewMedicines([{ medicineId: '', quantity: 1, dosage: '' }]); }} style={{ padding: '6px 16px', backgroundColor: '#cbd5e1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy</button>
                      <button onClick={submitAdditionalMedicines} style={{ padding: '6px 16px', backgroundColor: '#0f6eff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lưu Bổ Sung</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn-primary" onClick={() => { setIsRecordDetailModalOpen(false); setShowAddMedicineForm(false); setNewMedicines([{ medicineId: '', quantity: 1, dosage: '' }]); }}>Đóng toàn bộ</button>
            </div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 16000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '650px', maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#2563eb', borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}>📜 Lịch Sử Sổ Khám Bệnh nhân #{currentSelectedPatientId}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
              {historyRecords.length > 0 ? historyRecords.map((rec) => (
                <div key={rec.id} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold' }}>🩺 Bệnh án: #{rec.id}</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Tái khám: {rec.reexaminationDate || 'Không hẹn'}</span>
                  </div>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Chẩn đoán kết luận:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{rec.diagnosis}</span></p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong>Hướng điều trị:</strong> {rec.treatmentPlan || 'Không có ghi chú'}</p>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f6eff' }}>💊 Toa thuốc đi kèm:</span>
                    {rec.prescriptionDetails && rec.prescriptionDetails.length > 0 ? (
                      <ul style={{ margin: '5px 0 0 0', paddingLeft: '15px', fontSize: '13px' }}>
                        {rec.prescriptionDetails.map((med, idx) => (
                          <li key={idx}>{med.medicineName} (Số lượng: {med.quantity}) - {med.dosage}</li>
                        ))}
                      </ul>
                    ) : <span style={{ fontSize: '13px', fontStyle: 'italic', color: '#94a3b8' }}> Không bốc thuốc toa này.</span>}
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>📭 Chưa tìm thấy lịch sử lưu bệnh án nào của người bệnh này trên máy chủ.</div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => { setIsHistoryModalOpen(false); setHistoryRecords([]); }} style={{ padding: '10px 24px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}

      {isDrugDetailModalOpen && drugDetails && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 13000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>💊 Thông tin chi tiết thuốc</h3>
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

      {/* MODAL LỊCH HẸN THEO BỆNH NHÂN (LẬP BỆNH ÁN) */}
      {isPatientApptModalOpen && selectedPatientForAppt && (
        <div className="modal" style={{ display: 'flex', zIndex: 13000 }}>
          <div className="modal-content" style={{ width: '700px', maxWidth: '90vw' }}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', color: '#0f172a' }}>
              📋 Lịch hẹn chờ khám của: {selectedPatientForAppt.fullName || selectedPatientForAppt.name || selectedPatientForAppt.username}
            </h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Giờ</th>
                    <th>Triệu chứng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
               <tbody>
                  {/* 🚀 LỌC CHÍNH XÁC: So sánh Tên trong Lịch hẹn với Tên của Bệnh nhân */}
                  {appointments
                    .filter(a => a.status === 'CONFIRMED' && (
                        a.patientName === selectedPatientForAppt.fullName || 
                        a.patientName === selectedPatientForAppt.name || 
                        a.patientName === selectedPatientForAppt.username
                    ))
                    .map(appt => (
                      <tr key={appt.id}>
                        <td>{appt.appointmentDate}</td>
                        <td>{appt.startTime}</td>
                        <td>{appt.symptoms || appt.reason || appt.description || 'Không có ghi chú'}</td>
                        <td>
                          <button 
                            style={{ padding: '6px 12px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
                            onClick={() => { 
                              setIsPatientApptModalOpen(false); 
                              openRecordModal(appt.id); 
                              setApptDetails(appt);
                            }}
                          >
                            Lập bệnh án
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              {appointments.filter(a => (a.patientId === selectedPatientForAppt.id || a.patientId === selectedPatientForAppt.userId || a.patientId === selectedPatientForAppt.patientId) && a.status === 'CONFIRMED').length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b' }}>Bệnh nhân này hiện không có lịch hẹn nào đang ở trạng thái <strong>Đã xác nhận</strong> để khám.</p>
              )}
            </div>
            <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '15px' }}>
              <button className="btn-outline" onClick={() => setIsPatientApptModalOpen(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {isDeptModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 12000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>🏥 Danh sách Phòng ban / Chuyên khoa</h3>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {departments.length > 0 ? departments.map((dept, index) => {
                const deptName = dept.name || dept.departmentName || dept.department_name || "Chưa có tên";
                return (
                  <div key={dept.id || dept.departmentId || index} style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <strong style={{ color: '#0f6eff', fontSize: '16px' }}>{deptName}</strong>
                    <span style={{ fontSize: '14px', color: '#334155' }}>Mô tả: {dept.description || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Chưa có thông tin mô tả</span>}</span>
                  </div>
                )
              }) : (
                <p style={{ textAlign: 'center', color: '#64748b' }}>Không có dữ liệu phòng ban!</p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setIsDeptModalOpen(false)} style={{ padding: '8px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;