
export interface Education {
  school: string;
  major: string;
  startYear: string;
  endYear: string;
  status: string;
}

export interface Employment {
  company: string;
  position: string;
  description: string;
  years: string;
}

export interface FamilyMember {
  name: string;
  relationship: string;
}

export interface Employee {
  id: string;
  // 基本資料
  name: string;
  idNumber: string;
  birthday: string;
  gender: string;
  bloodType: string;
  marriage: string;
  military: string;
  license: string;
  transportation: string;
  height: string;
  weight: string;
  // 聯絡資訊
  phone: string;
  mobile: string;
  email: string;
  contactAddress: string;
  residentAddress: string;
  // 緊急聯絡人
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyMobile: string;
  // 學經歷與其他
  education: Education[];
  employment: Employment[];
  family: FamilyMember[];
  languages: string;
  // 人事單位填寫
  employeeNumber: string;
  position: string;
  department: string;
  onboardingDate: string;
  insuranceDate: string;
  salary: string;
  status: '待處理' | '入職中' | '已完成';
  remarks?: string;
}

export type ViewState = 'dashboard' | 'employees' | 'ocr' | 'analytics' | 'form' | 'print';

export interface DashboardStats {
  totalEmployees: number;
  onboardingProgress: number;
  departmentDistribution: { name: string; value: number }[];
  hiringTrends: { month: string; count: number }[];
}
