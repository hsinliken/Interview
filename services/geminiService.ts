
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performOCR = async (base64Image: string) => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    請從這張「新進員工基本資料」表格中提取所有資訊。
    這是一張繁體中文表單。請精確提取每個欄位的值，包括基本資料、聯絡資訊、緊急聯絡人、學歷、工作經歷以及人事單位的資料。
    如果欄位有勾選或標記，請提取該選項文字。
    請以 JSON 格式回傳，並符合指定的 Schema。
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "姓名" },
          idNumber: { type: Type.STRING, description: "身分證字號" },
          birthday: { type: Type.STRING, description: "出生日期" },
          gender: { type: Type.STRING, description: "性別" },
          bloodType: { type: Type.STRING, description: "血型" },
          marriage: { type: Type.STRING, description: "婚姻" },
          military: { type: Type.STRING, description: "役別" },
          license: { type: Type.STRING, description: "持有駕照" },
          transportation: { type: Type.STRING, description: "交通工具" },
          height: { type: Type.STRING, description: "身高" },
          weight: { type: Type.STRING, description: "體重" },
          phone: { type: Type.STRING, description: "聯絡電話" },
          mobile: { type: Type.STRING, description: "行動電話" },
          email: { type: Type.STRING, description: "電子郵件" },
          contactAddress: { type: Type.STRING, description: "聯絡地址" },
          residentAddress: { type: Type.STRING, description: "戶籍地址" },
          emergencyName: { type: Type.STRING, description: "緊急聯絡人姓名" },
          emergencyRelation: { type: Type.STRING, description: "緊急聯絡人關係" },
          emergencyPhone: { type: Type.STRING, description: "緊急聯絡人電話" },
          emergencyMobile: { type: Type.STRING, description: "緊急聯絡人行動電話" },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                school: { type: Type.STRING },
                major: { type: Type.STRING },
                startYear: { type: Type.STRING },
                endYear: { type: Type.STRING },
                status: { type: Type.STRING }
              }
            }
          },
          employment: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                position: { type: Type.STRING },
                description: { type: Type.STRING },
                years: { type: Type.STRING }
              }
            }
          },
          employeeNumber: { type: Type.STRING, description: "員工編號" },
          position: { type: Type.STRING, description: "職稱" },
          department: { type: Type.STRING, description: "所屬部門" },
          onboardingDate: { type: Type.STRING, description: "到職日" },
          insuranceDate: { type: Type.STRING, description: "勞健保加保日" },
          salary: { type: Type.STRING, description: "基本薪資" }
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse OCR response", e);
    return null;
  }
};

export const queryHRAIData = async (query: string, data: any[]) => {
  const model = 'gemini-3-flash-preview';
  const dataContext = JSON.stringify(data.slice(0, 50));

  const response = await ai.models.generateContent({
    model,
    contents: `
      你是一位專業的 HR 數據分析師。請使用繁體中文回答。
      以下是新進員工的 JSON 資料集：
      ${dataContext}

      使用者問題： "${query}"

      請僅根據提供的資料提供簡潔、專業的分析。如果資料中沒有答案，請如實告知。
    `,
  });

  return response.text;
};
