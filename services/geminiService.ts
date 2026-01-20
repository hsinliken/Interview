
import { GoogleGenAI, Type } from "@google/genai";

// 強健的 API Key 獲取器
const getApiKey = () => {
  // 優先從標準 process.env 獲取，其次嘗試常見的前端框架前綴
  const key = process.env.API_KEY || (process.env as any).VITE_API_KEY || (process.env as any).NEXT_PUBLIC_API_KEY;
  return key && key.trim() !== "" ? key : null;
};

const getAIInstance = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("Gemini SDK 初始化失敗: 找不到 API_KEY。請確保環境變數已正確設定。");
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const performOCR = async (base64Image: string) => {
  try {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      請從這張「新進員工基本資料」表格中提取所有資訊。
      這是一張繁體中文表單。請精確提取每個欄位的值，包括基本資料、聯絡資訊、緊急聯絡人、學歷、工作經歷以及人事單位的資料。
      請以繁體中文回傳 JSON 格式。
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
            name: { type: Type.STRING },
            idNumber: { type: Type.STRING },
            birthday: { type: Type.STRING },
            gender: { type: Type.STRING },
            bloodType: { type: Type.STRING },
            marriage: { type: Type.STRING },
            military: { type: Type.STRING },
            license: { type: Type.STRING },
            transportation: { type: Type.STRING },
            height: { type: Type.STRING },
            weight: { type: Type.STRING },
            phone: { type: Type.STRING },
            mobile: { type: Type.STRING },
            email: { type: Type.STRING },
            contactAddress: { type: Type.STRING },
            residentAddress: { type: Type.STRING },
            emergencyName: { type: Type.STRING },
            emergencyRelation: { type: Type.STRING },
            emergencyPhone: { type: Type.STRING },
            emergencyMobile: { type: Type.STRING },
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
            employeeNumber: { type: Type.STRING },
            position: { type: Type.STRING },
            department: { type: Type.STRING },
            onboardingDate: { type: Type.STRING },
            insuranceDate: { type: Type.STRING },
            salary: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e: any) {
    if (e.message === "API_KEY_MISSING") {
      throw new Error("偵測不到 API Key。Vercel 用戶請確保在後台設定 API_KEY 並考慮前綴（如 VITE_API_KEY）。");
    }
    throw new Error(`辨識失敗: ${e.message}`);
  }
};

export const queryHRAIData = async (query: string, data: any[]) => {
  try {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    const dataContext = JSON.stringify(data.slice(0, 50));

    const response = await ai.models.generateContent({
      model,
      contents: `
        你是一位專業的 HR 數據分析師。請使用繁體中文回答。
        以下是新進員工的 JSON 資料集：
        ${dataContext}
        
        使用者問題： "${query}"
      `,
    });

    return response.text;
  } catch (e: any) {
    if (e.message === "API_KEY_MISSING") {
      return "錯誤：找不到 API Key。請在 Vercel 設定中將環境變數命名為 VITE_API_KEY。";
    }
    return `分析失敗：${e.message}`;
  }
};
