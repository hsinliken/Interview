
import React from 'react';
import { Employee } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  onDelete: (id: string) => void;
  onEdit: (emp: Employee) => void;
  onPrint: (emp: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onDelete, onEdit, onPrint }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">員工名錄</h1>
          <p className="text-slate-500 mt-1">管理與查看所有新進人員的報到狀態</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">姓名 / 員工編號</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">部門 / 職稱</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">到職日期</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">狀態</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">操作項目</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-4">
                    <img src={`https://picsum.photos/seed/${emp.id}/40/40`} className="rounded-xl w-10 h-10 ring-2 ring-slate-100" alt="" />
                    <div>
                      <div className="font-bold text-slate-900">{emp.name}</div>
                      <div className="text-xs text-blue-600 font-mono">{emp.employeeNumber || '未編號'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-semibold text-slate-700">{emp.department}</div>
                  <div className="text-xs text-slate-500">{emp.position}</div>
                </td>
                <td className="px-6 py-5 text-sm font-medium text-slate-600">{emp.onboardingDate}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    emp.status === '已完成' ? 'bg-green-100 text-green-700' :
                    emp.status === '入職中' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right space-x-1">
                  <button 
                    onClick={() => onPrint(emp)} 
                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    title="列印套表"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  </button>
                  <button onClick={() => onEdit(emp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="編輯">
                    編輯
                  </button>
                  <button onClick={() => onDelete(emp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="刪除">
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">尚無新進員工資料</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
