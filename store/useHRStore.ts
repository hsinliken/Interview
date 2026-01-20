
import { useState, useCallback, useMemo } from 'react';
import { Employee, DashboardStats } from '../types';

const INITIAL_EMPLOYEES: Employee[] = [
  { 
    id: '1', 
    name: '陳小美', 
    idNumber: 'A2****6*8*',
    birthday: '1998/01/14',
    gender: '女',
    bloodType: 'A',
    marriage: '已婚',
    military: '免役',
    license: '機車',
    transportation: '機車、大眾運輸',
    height: '160公分',
    weight: '60公斤',
    email: 'lily.chen@hundredplus.com', 
    phone: '02-2357-8866', 
    mobile: '0911-101-111',
    contactAddress: '臺北市中正區忠孝東路一段150號',
    residentAddress: '同上',
    emergencyName: '媽媽',
    emergencyRelation: '母女',
    emergencyPhone: '02-6605-8369',
    emergencyMobile: '0922-222-222',
    department: '客服部', 
    position: '客服專員', 
    employeeNumber: 'HP00015',
    onboardingDate: '2024/04/22', 
    insuranceDate: '2024/04/22',
    salary: '35,000',
    status: '已完成',
    education: [{ school: '國立臺北商業大學', major: '財務金融系', startYear: '105', endYear: '109', status: '畢業' }],
    employment: [{ company: '美美資訊股份有限公司', position: '業務助理', description: '輔助業務完成後勤作業。', years: '2' }],
    family: [],
    languages: '國語精通, 英語良好'
  },
];

export const useHRStore = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  
  const addEmployee = useCallback((newEmp: Omit<Employee, 'id'>) => {
    const emp = { ...newEmp, id: Math.random().toString(36).substr(2, 9) };
    setEmployees(prev => [...prev, emp as Employee]);
    return emp;
  }, []);

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } as Employee : e));
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  const stats = useMemo((): DashboardStats => {
    const deptMap: Record<string, number> = {};
    employees.forEach(e => {
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });

    return {
      totalEmployees: employees.length,
      onboardingProgress: (employees.filter(e => e.status === '已完成').length / Math.max(employees.length, 1)) * 100,
      departmentDistribution: Object.entries(deptMap).map(([name, value]) => ({ name, value })),
      hiringTrends: [
        { month: '4月', count: 1 },
      ]
    };
  }, [employees]);

  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    stats
  };
};
