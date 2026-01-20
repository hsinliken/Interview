
import React from 'react';
import { Employee } from '../types';

interface PrintTemplateProps {
  employee: Employee;
  onClose: () => void;
}

const PrintTemplate: React.FC<PrintTemplateProps> = ({ employee, onClose }) => {
  const Checkbox = ({ checked }: { checked: boolean }) => (
    <span className="inline-block w-4 h-4 border border-slate-900 mr-1 text-center leading-3 font-bold">
      {checked ? 'v' : ''}
    </span>
  );

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      alert("瀏覽器封鎖了列印視窗，請嘗試按下 Ctrl + P 進行列印。");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:py-0">
      {/* 預覽控制列 - 在列印時必須隱藏 */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 no-print">
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h3 className="font-bold text-slate-800">列印預覽模式</h3>
            <p className="text-xs text-slate-500">請確認內容無誤後點擊右側按鈕</p>
          </div>
        </div>
        <div className="flex space-x-3">
           <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            立即列印
          </button>
        </div>
      </div>

      {/* 實際列印模板 - 確保此容器在列印時不被隱藏 */}
      <div className="print-content bg-white text-slate-900 text-[12px] leading-tight w-[210mm] min-h-[297mm] mx-auto p-[15mm] shadow-2xl print:shadow-none print:m-0 print:p-[10mm] print:w-full">
        <div className="text-center mb-4 relative">
          <h1 className="text-2xl font-bold tracking-widest underline underline-offset-8">新進員工基本資料</h1>
          <div className="absolute right-0 bottom-0 text-sm">
            填寫日期：<span className="underline px-2">{employee.onboardingDate || '2024/04/22'}</span>
          </div>
        </div>

        <table className="w-full border-collapse border-2 border-slate-900">
          <tbody>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50 w-24">姓名*</td>
              <td className="border border-slate-900 p-2 w-48 font-medium">{employee.name}</td>
              <td className="border border-slate-900 p-2 bg-slate-50 w-24">身分證字號*</td>
              <td className="border border-slate-900 p-2">{employee.idNumber}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">出生日期*</td>
              <td className="border border-slate-900 p-2">{employee.birthday}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">性別</td>
              <td className="border border-slate-900 p-2">{employee.gender}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">血型</td>
              <td className="border border-slate-900 p-2">{employee.bloodType}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">婚姻</td>
              <td className="border border-slate-900 p-2">{employee.marriage}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">役別</td>
              <td className="border border-slate-900 p-2">{employee.military}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">持有駕照</td>
              <td className="border border-slate-900 p-2">{employee.license}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">交通工具</td>
              <td className="border border-slate-900 p-2" colSpan={3}>{employee.transportation}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">身高</td>
              <td className="border border-slate-900 p-2">{employee.height}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">體重</td>
              <td className="border border-slate-900 p-2">{employee.weight}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">聯絡電話*</td>
              <td className="border border-slate-900 p-2">{employee.phone}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">行動電話*</td>
              <td className="border border-slate-900 p-2">{employee.mobile}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">電子郵件*</td>
              <td className="border border-slate-900 p-2" colSpan={3}>{employee.email}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">聯絡地址*</td>
              <td className="border border-slate-900 p-2" colSpan={3}>{employee.contactAddress}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">戶籍地址</td>
              <td className="border border-slate-900 p-2" colSpan={3}>{employee.residentAddress}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">緊急聯絡人</td>
              <td className="border border-slate-900 p-2">{employee.emergencyName}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">關係</td>
              <td className="border border-slate-900 p-2">{employee.emergencyRelation}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">聯絡電話</td>
              <td className="border border-slate-900 p-2">{employee.emergencyPhone}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">行動電話</td>
              <td className="border border-slate-900 p-2">{employee.emergencyMobile}</td>
            </tr>
          </tbody>
        </table>

        <div className="text-center font-bold bg-slate-100 border-x-2 border-slate-900 py-1 mt-0">學 歷</div>
        <table className="w-full border-collapse border-x-2 border-b-2 border-slate-900 text-center">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-900 p-1">學校名稱</th>
              <th className="border border-slate-900 p-1">科系</th>
              <th className="border border-slate-900 p-1">入校年份</th>
              <th className="border border-slate-900 p-1">離校年份</th>
              <th className="border border-slate-900 p-1">畢業業</th>
            </tr>
          </thead>
          <tbody>
            {(employee.education && employee.education.length > 0 ? employee.education : [{school: '', major: '', startYear: '', endYear: '', status: ''}]).map((edu, idx) => (
              <tr key={idx}>
                <td className="border border-slate-900 p-1 h-8">{edu.school}</td>
                <td className="border border-slate-900 p-1">{edu.major}</td>
                <td className="border border-slate-900 p-1">{edu.startYear}</td>
                <td className="border border-slate-900 p-1">{edu.endYear}</td>
                <td className="border border-slate-900 p-1">{edu.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center font-bold bg-slate-100 border-x-2 border-slate-900 py-1">工作經歷</div>
        <table className="w-full border-collapse border-x-2 border-b-2 border-slate-900 text-center">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-900 p-1">服務單位</th>
              <th className="border border-slate-900 p-1">職稱</th>
              <th className="border border-slate-900 p-1 w-1/2">工作說明</th>
              <th className="border border-slate-900 p-1">年資</th>
            </tr>
          </thead>
          <tbody>
            {(employee.employment && employee.employment.length > 0 ? employee.employment : [{company: '', position: '', description: '', years: ''}]).map((job, idx) => (
              <tr key={idx}>
                <td className="border border-slate-900 p-1 h-8">{job.company}</td>
                <td className="border border-slate-900 p-1">{job.position}</td>
                <td className="border border-slate-900 p-1 text-left">{job.description}</td>
                <td className="border border-slate-900 p-1">{job.years}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center font-bold bg-slate-100 border-x-2 border-slate-900 py-1">繳交資料</div>
        <div className="border-x-2 border-b-2 border-slate-900 p-4 grid grid-cols-2 gap-2">
          <div><Checkbox checked={false} /> 僱傭契約書</div>
          <div><Checkbox checked={true} /> 資安守則與保密切結書</div>
          <div><Checkbox checked={true} /> 身分證正反面影本</div>
          <div><Checkbox checked={true} /> 大頭照照片一張或圖檔一份</div>
          <div><Checkbox checked={true} /> 存摺影本</div>
          <div><Checkbox checked={true} /> 最高學歷畢業證書</div>
          <div><Checkbox checked={false} /> 退伍令影本</div>
          <div><Checkbox checked={false} /> 證照影本</div>
          <div><Checkbox checked={true} /> 扶養親屬表</div>
          <div><Checkbox checked={true} /> 健保轉出申請表影本</div>
        </div>

        <div className="text-center font-bold bg-slate-100 border-x-2 border-slate-900 py-1">人事單位填寫資料</div>
        <table className="w-full border-collapse border-x-2 border-b-2 border-slate-900">
          <tbody>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50 w-24">員工編號*</td>
              <td className="border border-slate-900 p-2 w-48 font-mono">{employee.employeeNumber}</td>
              <td className="border border-slate-900 p-2 bg-slate-50 w-24">職稱*</td>
              <td className="border border-slate-900 p-2">{employee.position}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">所屬部門*</td>
              <td className="border border-slate-900 p-2">{employee.department}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">到職日*</td>
              <td className="border border-slate-900 p-2">{employee.onboardingDate}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">勞健保加保日</td>
              <td className="border border-slate-900 p-2">{employee.insuranceDate}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">團體加保日</td>
              <td className="border border-slate-900 p-2">{employee.insuranceDate}</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">基本薪資*</td>
              <td className="border border-slate-900 p-2">{employee.salary}</td>
              <td className="border border-slate-900 p-2 bg-slate-50">其他薪資</td>
              <td className="border border-slate-900 p-2">0</td>
            </tr>
            <tr>
              <td className="border border-slate-900 p-2 bg-slate-50">備註</td>
              <td className="border border-slate-900 p-2" colSpan={3}>{employee.remarks || '無。'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .print-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 210mm;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 10mm !important;
            border: none !important;
            visibility: visible !important;
          }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default PrintTemplate;
