
import React, { useState, useEffect } from 'react';
import { Employee } from '../types';

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (data: Omit<Employee, 'id'>) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '', idNumber: '', birthday: '', gender: '女', bloodType: 'A', marriage: '未婚',
    military: '免役', license: '', transportation: '', height: '', weight: '',
    phone: '', mobile: '', email: '', contactAddress: '', residentAddress: '',
    emergencyName: '', emergencyRelation: '', emergencyPhone: '', emergencyMobile: '',
    education: [], employment: [], family: [], languages: '',
    employeeNumber: '', position: '', department: '', onboardingDate: '', insuranceDate: '', salary: '',
    status: '待處理', remarks: ''
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData(rest as Omit<Employee, 'id'>);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fixed: Made children optional to resolve "Property 'children' is missing" errors in various TypeScript configurations
  const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="mb-8 border-b border-slate-100 pb-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, name, type = "text", required = false }: { label: string, name: string, type?: string, required?: boolean }) => (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-600">{label}{required && <span className="text-red-500">*</span>}</label>
      <input
        required={required}
        name={name}
        type={type}
        value={(formData as any)[name] || ''}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-5xl mx-auto mb-20">
      <header className="mb-10 text-center">
        <h2 className="text-2xl font-black text-slate-900">{initialData ? '修改' : '建立'} 新進員工資料</h2>
        <p className="text-slate-500 mt-2">請依照紙本表單內容填寫或確認 AI 辨識結果</p>
      </header>

      <form onSubmit={handleSubmit}>
        <Section title="基本資料">
          <InputField label="姓名" name="name" required />
          <InputField label="身分證字號" name="idNumber" required />
          <InputField label="出生日期" name="birthday" type="text" />
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">性別</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none text-sm">
              <option>男</option><option>女</option>
            </select>
          </div>
          <InputField label="血型" name="bloodType" />
          <InputField label="婚姻" name="marriage" />
          <InputField label="役別" name="military" />
          <InputField label="持有駕照" name="license" />
          <InputField label="身高" name="height" />
          <InputField label="體重" name="weight" />
          <InputField label="交通工具" name="transportation" />
        </Section>

        <Section title="聯絡資訊">
          <InputField label="聯絡電話" name="phone" />
          <InputField label="行動電話" name="mobile" required />
          <InputField label="電子郵件" name="email" type="email" required />
          <div className="md:col-span-2 lg:col-span-3">
            <InputField label="聯絡地址" name="contactAddress" />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <InputField label="戶籍地址" name="residentAddress" />
          </div>
        </Section>

        <Section title="緊急聯絡人">
          <InputField label="姓名" name="emergencyName" />
          <InputField label="關係" name="emergencyRelation" />
          <InputField label="電話" name="emergencyPhone" />
          <InputField label="行動電話" name="emergencyMobile" />
        </Section>

        <Section title="人事單位填寫">
          <InputField label="員工編號" name="employeeNumber" />
          <InputField label="所屬部門" name="department" />
          <InputField label="職稱" name="position" />
          <InputField label="到職日" name="onboardingDate" />
          <InputField label="勞健保加保日" name="insuranceDate" />
          <InputField label="基本薪資" name="salary" />
        </Section>

        <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200">
          <button type="button" onClick={onCancel} className="px-8 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 transition-all font-bold text-slate-600">
            取消
          </button>
          <button type="submit" className="px-10 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200">
            儲存資料
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
