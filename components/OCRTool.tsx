
import React, { useState, useRef } from 'react';
import { performOCR } from '../services/geminiService';

interface OCRToolProps {
  onDataExtracted: (data: any) => void;
}

const OCRTool: React.FC<OCRToolProps> = ({ onDataExtracted }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMsg(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const base64Data = image.split(',')[1];
      const result = await performOCR(base64Data);
      if (result) {
        onDataExtracted(result);
      }
    } catch (error: any) {
      console.error("OCR Error:", error);
      setErrorMsg(error.message || "發生未知錯誤");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI 智能紙本辨識</h2>
        <p className="text-slate-500 mt-2">上傳「新進員工基本資料」表單，由 Gemini 自動提取繁體中文欄位</p>
      </header>

      <div className="flex flex-col items-center space-y-8">
        <div 
          className={`w-full aspect-[3/4] max-h-[500px] border-4 border-dashed rounded-3xl bg-slate-50 flex items-center justify-center overflow-hidden relative transition-all group cursor-pointer ${
            image ? 'border-blue-500 bg-white' : 'border-slate-200 hover:border-blue-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <img src={image} className="w-full h-full object-contain" alt="Preview" />
          ) : (
            <div className="text-center p-10">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-slate-600 font-bold text-lg">點擊此處上傳表單照片</p>
              <p className="text-slate-400 text-sm mt-2">支援 JPG, PNG 格式，請確保文字清晰</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        {errorMsg && (
          <div className="w-full bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start space-x-3 text-red-700 animate-in slide-in-from-top-2">
            <svg className="w-6 h-6 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="font-bold">辨識功能無法啟動</p>
              <p className="text-sm opacity-90">{errorMsg}</p>
              {errorMsg.includes("API Key") && (
                <p className="text-xs mt-2 underline opacity-70">
                  提示：Vercel 前端無法讀取私密變數。請將 Key 命名為 VITE_API_KEY 並設為公開，或確認是否有重新部署。
                </p>
              )}
            </div>
          </div>
        )}

        <div className="w-full">
          <button
            onClick={handleScan}
            disabled={!image || isProcessing}
            className={`w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-2xl shadow-blue-200 transition-all ${
              (!image || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Gemini 正在讀取繁體中文資料...
              </span>
            ) : '立即啟動 AI 自動填表'}
          </button>
        </div>

        {isProcessing && (
          <div className="w-full space-y-4">
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-full origin-left animate-pulse"></div>
             </div>
             <p className="text-center text-slate-400 text-sm font-medium animate-pulse">正在提取姓名、身份證字號、學經歷等資訊...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRTool;
