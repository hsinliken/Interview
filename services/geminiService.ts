
import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv && metaEnv.VITE_API_KEY) return metaEnv.VITE_API_KEY;
  } catch (e) {}

  if (typeof process !== 'undefined' && process.env) {
    const env = process.env as any;
    return env.API_KEY || env.VITE_API_KEY || env.NEXT_PUBLIC_API_KEY || null;
  }

  return null;
};

const getAIInstance = () => {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === "undefined" || apiKey.trim() === "") {
    const errorMsg = "偵測不到 API Key。請確保已在 Vercel 設定 VITE_API_KEY 並執行 Redeploy。";
    throw new Error(errorMsg);
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * 執行 OCR 與文件分析
 * @param content 可以是 base64 字串 (圖片/PDF) 或者是 提取出來的文字 (Word/Excel)
 * @param mimeType 內容的 MIME 類型，如果是純文字則為 'text/plain'
 */
export const performOCR = async (content: string, mimeType: string = 'image/jpeg') => {
  try {
    const ai = getAIInstance();
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      請從這份文件（可能是圖片、PDF、Excel 內容或 Word 內容）中提取「新進員工基本資料」。
      這是一份繁體中文表單。請精確提取每個欄位的值。
      請注意：如果文件中包含表格，請將其對應到 JSON 結構中的 education (學歷) 與 employment (工作經歷) 陣列中。
      請務必以繁體中文回傳 JSON 格式。
    `;

    let parts: any[] = [];
    if (mimeType === 'text/plain') {
      parts = [{ text: prompt }, { text: content }];
    } else {
      parts = [
        { inlineData: { mimeType: mimeType, data: content } },
        { text: prompt }
      ];
    }

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
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
    throw new Error(e.message || "文件辨識分析失敗");
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
    return `分析失敗：${e.message}`;
  }
};
