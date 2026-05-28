import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateDoctorAPI, getAllDoctorsAPI, searchDoctorsAPI, getAllUsersAPI, softDeleteUserAPI } from '../../services/adminService'; // 🚀 ĐÃ THÊM API USERS
import { getAllDepartmentsAPI, createDepartmentAPI, updateDepartmentAPI, deleteDepartmentAPI } from '../../services/departmentService';
import { createAppointmentAPI, getAppointmentDetailsAPI, deleteAppointmentAPI } from '../../services/appointmentService';
import { getAllDrugsAPI, createDrugAPI, getDrugDetailsAPI, updateDrugAPI, deleteDrugAPI } from '../../services/drugService';
// 🚀 ĐÃ IMPORT ĐẦY ĐỦ 5 HÀM API
import { createMedicalRecordAPI, getMedicalRecordDetailsAPI, getMedicalHistoryByPatientAPI, addMedicinesToRecordAPI, getPrescriptionsByRecordAPI } from '../../services/medicalRecordService';
import '../../style/base.css';
import '../../style/admin.css';
import Sidebar from './Sidebar';
import Header from './Header';
import DoctorTab from './DoctorTab';
import AppointmentTab from './AppointmentTab';
import DepartmentTab from './DepartmentTab';
import DrugTab from './DrugTab';
import PatientTab from './PatientTab'; // 🚀 ĐÃ THÊM COMPONENT BỆNH NHÂN

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('doctors'); // 🚀 ĐÃ SỬA THÀNH 'doctors'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🚀 ĐÃ THÊM STATE BỆNH NHÂN
  const [patients, setPatients] = useState([]);
  const [isPatientLoading, setIsPatientLoading] = useState(false);

  const [specialties, setSpecialties] = useState([]);
  const [isDeptLoading, setIsDeptLoading] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [isDrugLoading, setIsDrugLoading] = useState(false);
  
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', isEdit: false });
  const [formData, setFormData] = useState({});
  const [searchApptId, setSearchApptId] = useState('');
  const [apptDetails, setApptDetails] = useState(null);
  const [isApptDetailModalOpen, setIsApptDetailModalOpen] = useState(false);
  const [drugDetails, setDrugDetails] = useState(null);
  const [isDrugDetailModalOpen, setIsDrugDetailModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordForm, setRecordForm] = useState({ appointmentId: '', diagnosis: '', treatmentPlan: '', reexaminationDate: '', medicines: [] });
  const [searchRecordId, setSearchRecordId] = useState('');
  const [recordDetails, setRecordDetails] = useState(null);
  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);
  const [searchPatientHistoryId, setSearchPatientHistoryId] = useState('');
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [newMedicines, setNewMedicines] = useState([{ medicineId: '', quantity: 1, dosage: '' }]);
  
  // 🚀 ĐÃ SỬA: CHUẨN HÓA DỮ LIỆU BÁC SĨ
  const fetchDoctors = async (searchKeyword = '') => {
    setIsLoading(true);
    try {
      let response = searchKeyword.trim() !== '' ? await searchDoctorsAPI(searchKeyword) : await getAllDoctorsAPI(0);
      // Bắt mọi tầng dữ liệu
      const actualDoctorArray = response.data?.data?.doctors || response.data?.data?.doctorList || response.data?.data?.content || response.data?.data || response.data || response || [];
      setDoctors(Array.isArray(actualDoctorArray) ? actualDoctorArray : []);
    } catch (error) { setDoctors([]); } finally { setIsLoading(false); }
  };

  // 🚀 THÊM MỚI: HÀM FETCH BỆNH NHÂN
  const fetchPatients = async () => {
    setIsPatientLoading(true);
    try {
      const response = await getAllUsersAPI(); 
      const allUsers = response.data?.data?.users || response.data?.data?.content || response.data?.data || [];
      const patientList = allUsers.filter(u => u.role === 'PATIENT' || u.role === 'ROLE_PATIENT' || u.roleId === 2);
      setPatients(patientList);
    } catch (error) { console.error("Lỗi lấy bệnh nhân:", error); } finally { setIsPatientLoading(false); }
  };

  // 🚀 THÊM MỚI: HÀM XÓA MỀM BỆNH NHÂN
  const handleSoftDeletePatient = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn khóa (xóa mềm) tài khoản bệnh nhân này không?")) {
      try {
        await softDeleteUserAPI(id);
        alert("Khóa tài khoản bệnh nhân thành công!");
        fetchPatients(); 
      } catch (error) { alert("Lỗi khi khóa tài khoản!"); }
    }
  };

  //  QUÉT MẢNG DỮ LIỆU mảng phòng ban
  const fetchDepartments = async () => {
    setIsDeptLoading(true);
    try {
      const response = await getAllDepartmentsAPI(0);
      
      // Lôi đích danh cái mảng departmentResponseList ra
      const actualDeptArray = 
        response.data?.data?.departmentResponseList || 
        response.data?.departmentResponseList || 
        response.data?.data?.departments || 
        response.data?.data?.content || 
        response.data?.data || 
        [];
      
      const rawArray = Array.isArray(actualDeptArray) ? actualDeptArray : [];
      
      // Chuẩn hóa tên biến
      const normalizedDepts = rawArray.map(dept => ({
        ...dept,
        id: dept.id || dept.departmentId,
        name: dept.name || dept.departmentName || dept.department_name
      }));
      
      setSpecialties(normalizedDepts);
    } catch (error) { 
      console.error("Lỗi lấy phòng ban:", error);
      setSpecialties([]); 
    } finally { 
      setIsDeptLoading(false); 
    }
  };
  // 🚀 ĐÃ SỬA: CHUẨN HÓA DỮ LIỆU THUỐC
  const fetchDrugs = async () => {
    setIsDrugLoading(true);
    try {
      const response = await getAllDrugsAPI(0, 100);
      // Bắt mọi tầng dữ liệu
      const actualDrugArray = response.data?.data?.content || response.data?.data || response.data || response || [];
      setDrugs(Array.isArray(actualDrugArray) ? actualDrugArray : []);
    } catch (error) { setDrugs([]); } finally { setIsDrugLoading(false); }
  };
  
  useEffect(() => { fetchDepartments(); fetchDrugs(); fetchPatients(); }, []); // 🚀 ĐÃ THÊM fetchPatients()
  useEffect(() => { const timer = setTimeout(() => fetchDoctors(searchTerm), 500); return () => clearTimeout(timer); }, [searchTerm]);
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };
  const handleDelete = async (type, id) => {
    if (window.confirm("Xóa mục này khỏi hệ thống?")) {
      if (type === 'specialty') { try { await deleteDepartmentAPI(id); fetchDepartments(); alert("Xóa thành công!"); } catch (e) { alert("Xóa thất bại!"); } }
      if (type === 'drug') { try { await deleteDrugAPI(id); fetchDrugs(); alert("🗑️ Đã xóa thuốc thành công!"); } catch (e) { alert("Xóa thất bại!"); } }
      if (type === 'doctor') alert("Đang cập nhật API!");
    }
  };
  const openModal = (type, data = null) => { setModalConfig({ isOpen: true, type, isEdit: !!data }); setFormData(data || {}); };
  const closeModal = () => { setModalConfig({ isOpen: false, type: '', isEdit: false }); setFormData({}); };
  const handleViewDrugDetails = async (id) => { try { const res = await getDrugDetailsAPI(id); setDrugDetails(res.data?.data || res.data); setIsDrugDetailModalOpen(true); } catch (e) { alert("Lỗi!"); } };
  
  const handleViewAppointmentDetails = async (id) => {
    if (!id) return alert("Vui lòng nhập ID lịch hẹn!");
    try { const res = await getAppointmentDetailsAPI(id); setApptDetails(res.data?.data || res.data); setIsApptDetailModalOpen(true); } catch (e) { alert("Không tìm thấy!"); }
  };
  const handleAdminDeleteAppointment = async (id) => {
    if (window.confirm(`XÓA HOÀN TOÀN lịch hẹn #${id}?`)) { try { await deleteAppointmentAPI(id); alert("Đã xóa!"); setIsApptDetailModalOpen(false); setSearchApptId(''); } catch (e) { alert("Thất bại!"); } }
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
    if (!patientId) return alert("Vui lòng nhập mã ID Bệnh nhân!");
    setSearchPatientHistoryId(patientId);
    try {
      const response = await getMedicalHistoryByPatientAPI(patientId);
      const dataArr = response.data?.data || response.data || [];
      setHistoryRecords(Array.isArray(dataArr) ? dataArr : []);
      setIsHistoryModalOpen(true);
    } catch (error) { alert("Không tìm thấy lịch sử khám bệnh của bệnh nhân này!"); }
  };
  const openRecordModal = (appointmentId) => { setRecordForm({ appointmentId: appointmentId, diagnosis: '', treatmentPlan: '', reexaminationDate: '', medicines: [{ medicineId: drugs.length > 0 ? drugs[0].id : '', quantity: 1, dosage: '' }] }); setIsRecordModalOpen(true); };
  const handleAddMedicineToRecord = () => setRecordForm({ ...recordForm, medicines: [...recordForm.medicines, { medicineId: drugs.length > 0 ? drugs[0].id : '', quantity: 1, dosage: '' }] });
  const handleMedicineChange = (index, field, value) => { const newMedicines = [...recordForm.medicines]; newMedicines[index][field] = value; setRecordForm({ ...recordForm, medicines: newMedicines }); };
  const handleRemoveMedicine = (index) => { const newMedicines = recordForm.medicines.filter((_, i) => i !== index); setRecordForm({ ...recordForm, medicines: newMedicines }); };
  const handleSaveMedicalRecord = async () => { try { const payload = { appointmentId: parseInt(recordForm.appointmentId), diagnosis: recordForm.diagnosis, treatmentPlan: recordForm.treatmentPlan, reexaminationDate: recordForm.reexaminationDate || null, medicines: recordForm.medicines.map(m => ({ medicineId: parseInt(m.medicineId), quantity: parseInt(m.quantity), dosage: m.dosage })) }; await createMedicalRecordAPI(payload); alert("🩺 Đã lập bệnh án thành công!"); setIsRecordModalOpen(false); setIsApptDetailModalOpen(false); } catch (e) { alert("Lập bệnh án thất bại!"); } };
  const handleAddMoreMedicineRow = () => setNewMedicines([...newMedicines, { medicineId: '', quantity: 1, dosage: '' }]);
  const handleNewMedicineChange = (index, field, value) => { const updated = [...newMedicines]; updated[index][field] = value; setNewMedicines(updated); };
  const handleRemoveNewMedicine = (index) => { const updated = newMedicines.filter((_, i) => i !== index); setNewMedicines(updated); };
  
  const submitAdditionalMedicines = async () => {
    const isValid = newMedicines.every(m => m.medicineId && m.quantity > 0 && m.dosage);
    if (!isValid) return alert("Vui lòng nhập đầy đủ thông tin thuốc bổ sung (tên thuốc, số lượng, liều dùng)!");
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
    } catch (error) { alert("Lỗi khi bổ sung thuốc. Vui lòng kiểm tra lại!"); }
  };
  const handleSaveModal = async () => {
    if (modalConfig.type === 'doctor' && modalConfig.isEdit) { try { await updateDoctorAPI({ userId: formData.id || formData.userId, departmentId: parseInt(formData.departmentId), specialization: formData.specialization, experienceYears: parseInt(formData.experienceYears) }); fetchDoctors(searchTerm); alert("Cập nhật thành công!"); } catch (e) { alert("Lỗi!"); return; } }
    else if (modalConfig.type === 'specialty') {
      const payload = { name: formData.name || formData.departmentName, description: formData.description || '' };
      if (!modalConfig.isEdit) { try { await createDepartmentAPI(payload); fetchDepartments(); alert("Tạo thành công!"); } catch (e) { alert("Lỗi!"); return; } } 
      else { try { await updateDepartmentAPI(formData.id || formData.departmentId, payload); fetchDepartments(); alert("Cập nhật thành công!"); } catch (e) { alert("Lỗi!"); return; } }
    }
    else if (modalConfig.type === 'appointment') { try { await createAppointmentAPI({ patientId: parseInt(formData.patientId), doctorId: parseInt(formData.doctorId), appointmentDate: formData.appointmentDate, startTime: formData.startTime.length === 5 ? formData.startTime + ":00" : formData.startTime, symptoms: formData.symptoms || "Khám bệnh tổng quát" }); alert("Tạo lịch thành công!"); } catch (e) { alert("Lỗi!"); return; } }
    else if (modalConfig.type === 'drug') {
      const payload = { name: formData.name, unit: formData.unit || 'Viên' };
      if (!modalConfig.isEdit) { try { await createDrugAPI(payload); fetchDrugs(); alert("Thêm thuốc thành công!"); } catch (e) { alert("Lỗi!"); return; } } 
      else { try { await updateDrugAPI(formData.id, payload); fetchDrugs(); alert("Cập nhật thành công!"); } catch (e) { alert("Lỗi!"); return; } }
    }
    closeModal();
  };
  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
      
      <main className="main-content">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="page-content">
          <h1 className="page-title">Bảng điều khiển quản trị</h1>
          <div className="management-grid">
            {/* 🚀 ĐÃ CẬP NHẬT TAB HIỂN THỊ TẠI ĐÂY */}
            {activeTab === 'doctors' && <DoctorTab doctors={doctors} isLoading={isLoading} openModal={openModal} handleDelete={handleDelete} />}
            {activeTab === 'patients' && <PatientTab patients={patients} isLoading={isPatientLoading} handleSoftDelete={handleSoftDeletePatient} />}
            {activeTab === 'appointments' && (
              <AppointmentTab 
                doctors={doctors}
                openModal={openModal} searchApptId={searchApptId} setSearchApptId={setSearchApptId} handleViewAppointmentDetails={handleViewAppointmentDetails} searchRecordId={searchRecordId} setSearchRecordId={setSearchRecordId} handleViewMedicalRecord={handleViewMedicalRecord} searchPatientHistoryId={searchPatientHistoryId} setSearchPatientHistoryId={setSearchPatientHistoryId} handleViewPatientHistory={handleViewPatientHistory}
              />
            )}
            {activeTab === 'specialties' && <DepartmentTab specialties={specialties} isDeptLoading={isDeptLoading} openModal={openModal} handleDelete={handleDelete} />}
            {activeTab === 'drugs' && <DrugTab drugs={drugs} isDrugLoading={isDrugLoading} openModal={openModal} handleViewDrugDetails={handleViewDrugDetails} handleDelete={handleDelete} />}
          </div>
        </div>
      </main>
      {/* MODAL THÊM / SỬA */}
      {modalConfig.isOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>{modalConfig.isEdit ? 'Cập nhật thông tin' : 'Thêm mới'}</h3>
            {modalConfig.type === 'doctor' && (
              <>
                <input type="text" placeholder="Họ tên (Chỉ xem)" value={formData.fullName || ''} disabled style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed' }} />
                <input type="number" placeholder="ID Phòng khoa" value={formData.departmentId || ''} onChange={e => setFormData({...formData, departmentId: e.target.value})} required />
                <input type="text" placeholder="Chuyên môn" value={formData.specialization || ''} onChange={e => setFormData({...formData, specialization: e.target.value})} required />
                <input type="number" placeholder="Số năm kinh nghiệm" value={formData.experienceYears || ''} onChange={e => setFormData({...formData, experienceYears: e.target.value})} required />
              </>
            )}
            {modalConfig.type === 'specialty' && (
              <>
                <input type="text" placeholder="Tên phòng ban *" value={formData.name || formData.departmentName || ''} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={modalConfig.isEdit} />
                <input type="text" placeholder="Mô tả" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </>
            )}
            {modalConfig.type === 'drug' && (
              <>
                <input type="text" placeholder="Tên thuốc mới *" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required style={{padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box'}} />
                <input type="text" placeholder="Đơn vị tính" value={formData.unit || ''} onChange={e => setFormData({...formData, unit: e.target.value})} style={{padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box'}} />
              </>
            )}
            <div className="modal-actions">
              <button className="btn-outline" onClick={closeModal}>Hủy</button>
              <button className="btn-primary" onClick={handleSaveModal}>Lưu</button>
            </div>
          </div>
        </div>
      )}
      
      {/* MODAL CHI TIẾT LỊCH HẸN */}
      {isApptDetailModalOpen && apptDetails && (
        <div className="modal" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Chi tiết Lịch hẹn #{apptDetails.id}</h3>
            <div style={{ textAlign: 'left', margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
              <p style={{ margin: 0 }}><strong>Bệnh nhân:</strong> {apptDetails.patientName || 'Chưa rõ'}</p>
              <p style={{ margin: 0 }}><strong>Bác sĩ:</strong> {apptDetails.doctorName || 'Chưa rõ'}</p>
              <p style={{ margin: 0 }}><strong>Ngày khám:</strong> {apptDetails.appointmentDate}</p>
              <p style={{ margin: 0 }}><strong>Giờ hẹn:</strong> {apptDetails.startTime}</p>
              <p style={{ margin: 0 }}><strong>Trạng thái:</strong> <span className={`status-badge ${apptDetails.status === 'PENDING' ? 'pending' : (apptDetails.status === 'CANCELLED' ? 'cancelled' : 'confirmed')}`}>{apptDetails.status}</span></p>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
              <div>
                 <button onClick={() => handleAdminDeleteAppointment(apptDetails.id)} style={{ padding: '10px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' }}>Xóa</button>
                 <button onClick={() => openRecordModal(apptDetails.id)} style={{ padding: '10px 16px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lập bệnh án</button>
              </div>
              <button className="btn-primary" onClick={() => setIsApptDetailModalOpen(false)}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL LẬP BỆNH ÁN TỪ ĐẦU */}
      {isRecordModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 14000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '600px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>🩺 Lập bệnh án & Kê đơn</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
               <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}><strong>👤 Bệnh nhân:</strong> {apptDetails?.patientName || 'Chưa rõ'}</p>
               <p style={{ margin: 0, fontSize: '14px', color: '#ef4444' }}><strong>⚠️ Triệu chứng:</strong> {apptDetails?.symptoms || 'Bệnh nhân không ghi chú triệu chứng.'}</p>
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
      {/* MODAL XEM CHI TIẾT VÀ BỔ SUNG THUỐC VÀO BỆNH ÁN LẺ */}
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
            {/* FORM KÊ THÊM THUỐC BỔ SUNG */}
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
      {/* MODAL LỊCH SỬ KHÁM */}
      {isHistoryModalOpen && (
        <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 16000 }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '650px', maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: 0, color: '#2563eb', borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}>📜 Lịch Sử Sổ Khám Bệnh nhân #{searchPatientHistoryId}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
              {historyRecords.length > 0 ? historyRecords.map((rec) => (
                <div key={rec.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold', color: '#0f172a' }}>🩺 Bệnh án mã số: #{rec.id}</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Hẹn tái khám: {rec.reexaminationDate || 'Không hẹn'}</span>
                  </div>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Chẩn đoán kết luận:</strong> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{rec.diagnosis}</span></p>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}><strong>Kế hoạch điều trị:</strong> {rec.treatmentPlan || 'Không có hướng dẫn thêm'}</p>
                  <div style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f6eff' }}>💊 Đơn thuốc toa này:</span>
                    {rec.prescriptionDetails && rec.prescriptionDetails.length > 0 ? (
                      <ul style={{ margin: '5px 0 0 0', paddingLeft: '15px', fontSize: '13px' }}>
                        {rec.prescriptionDetails.map((med, idx) => (
                          <li key={idx}>{med.medicineName} (SL: {med.quantity}) - <span style={{ color: '#64748b' }}>{med.dosage}</span></li>
                        ))}
                      </ul>
                    ) : <span style={{ fontSize: '13px', fontStyle: 'italic', color: '#94a3b8' }}> Không kê toa thuốc.</span>}
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>📭 Bệnh nhân này chưa từng có lịch sử lập bệnh án nào trên hệ thống.</div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => { setIsHistoryModalOpen(false); setHistoryRecords([]); }} style={{ padding: '10px 24px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Đóng sổ khám</button>
            </div>
          </div>
        </div>
      )}
      {/* CHI TIẾT THUỐC */}
      {isDrugDetailModalOpen && drugDetails && (
        <div className="modal" style={{ display: 'flex', zIndex: 12000 }}>
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}> 💊 Chi tiết Thuốc #{drugDetails.id}</h3>
            <div style={{ textAlign: 'left', margin: '15px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px' }}>
              <p style={{ margin: 0 }}><strong>Tên thuốc:</strong> <span style={{color: '#0f6eff', fontWeight: 'bold'}}>{drugDetails.name}</span></p>
              <p style={{ margin: 0 }}><strong>Đơn vị tính:</strong> {drugDetails.unit || 'Chưa rõ'}</p>
            </div>
            <div className="modal-actions" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn-primary" onClick={() => setIsDrugDetailModalOpen(false)}>Đóng lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;