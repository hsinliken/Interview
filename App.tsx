
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import OCRTool from './components/OCRTool';
import SmartAnalytics from './components/SmartAnalytics';
import PrintTemplate from './components/PrintTemplate';
import { useHRStore } from './store/useHRStore';
import { ViewState, Employee } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [printingEmployee, setPrintingEmployee] = useState<Employee | null>(null);
  const { employees, addEmployee, updateEmployee, deleteEmployee, stats } = useHRStore();

  const handleFormSubmit = (data: Omit<Employee, 'id'>) => {
    if (editingEmployee && editingEmployee.id !== 'temp') {
      updateEmployee(editingEmployee.id, data);
    } else {
      addEmployee(data);
    }
    setEditingEmployee(null);
    setCurrentView('employees');
  };

  const handleEditClick = (emp: Employee) => {
    setEditingEmployee(emp);
    setCurrentView('form');
  };

  const handlePrintClick = (emp: Employee) => {
    setPrintingEmployee(emp);
    setCurrentView('print');
  };

  const handleOCRData = (data: any) => {
    const newEmp: Omit<Employee, 'id'> = {
      name: data.name || '',
      idNumber: data.idNumber || '',
      birthday: data.birthday || '',
      gender: data.gender || '女',
      bloodType: data.bloodType || '',
      marriage: data.marriage || '',
      military: data.military || '',
      license: data.license || '',
      transportation: data.transportation || '',
      height: data.height || '',
      weight: data.weight || '',
      phone: data.phone || '',
      mobile: data.mobile || '',
      email: data.email || '',
      contactAddress: data.contactAddress || '',
      residentAddress: data.residentAddress || '',
      emergencyName: data.emergencyName || '',
      emergencyRelation: data.emergencyRelation || '',
      emergencyPhone: data.emergencyPhone || '',
      emergencyMobile: data.emergencyMobile || '',
      education: data.education || [],
      employment: data.employment || [],
      family: [],
      languages: '',
      employeeNumber: data.employeeNumber || '',
      position: data.position || '',
      department: data.department || '',
      onboardingDate: data.onboardingDate || '',
      insuranceDate: data.insuranceDate || '',
      salary: data.salary || '',
      status: '待處理',
      remarks: ''
    };
    
    setEditingEmployee({ ...newEmp, id: 'temp' } as Employee);
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 側邊欄與主要內容，僅在非列印視圖顯示 */}
      {currentView !== 'print' && (
        <>
          <Sidebar currentView={currentView} setView={setCurrentView} />
          <main className="flex-1 ml-64 p-10">
            <div className="max-w-6xl mx-auto">
              {currentView === 'dashboard' && <Dashboard stats={stats} />}
              
              {currentView === 'employees' && (
                <EmployeeList 
                  employees={employees} 
                  onDelete={deleteEmployee} 
                  onEdit={handleEditClick} 
                  onPrint={handlePrintClick}
                />
              )}
              
              {currentView === 'form' && (
                <EmployeeForm 
                  initialData={editingEmployee}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setEditingEmployee(null);
                    setCurrentView('employees');
                  }}
                />
              )}
              
              {currentView === 'ocr' && (
                <OCRTool onDataExtracted={handleOCRData} />
              )}
              
              {currentView === 'analytics' && (
                <SmartAnalytics employees={employees} />
              )}
            </div>
          </main>
        </>
      )}

      {/* 獨立的列印預覽視圖 */}
      {currentView === 'print' && printingEmployee && (
        <div className="w-full">
          <PrintTemplate 
            employee={printingEmployee} 
            onClose={() => {
              setPrintingEmployee(null);
              setCurrentView('employees');
            }}
          />
        </div>
      )}

      {/* 手機版按鈕 */}
      {currentView !== 'print' && (
        <div className="md:hidden fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
          <button 
            onClick={() => setCurrentView('form')}
            className="bg-blue-600 text-white p-5 rounded-3xl shadow-2xl hover:scale-105 transition-all"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          main, sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
