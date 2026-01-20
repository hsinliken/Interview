
import React, { useState, useRef } from 'react';
import { performOCR } from '../services/geminiService';

interface OCRToolProps {
  onDataExtracted: (data: any) => void;
}

const OCRTool: React.FC<OCRToolProps> = ({ onDataExtracted }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    try {
      const base64Data = image.split(',')[1];
      const result = await performOCR(base64Data);
      if (result) {
        onDataExtracted(result);
      }
    } catch (error) {
      alert("掃描過程中發生錯誤，請稍後再試。");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-900">AI 智能紙本辨識</h2>
        <p className="text-slate-500 mt-2">上傳或拍攝「新進員工基本資料」表單，Gemini 將自動為您填寫系統欄位</p>
      </header>

      <div className="flex flex-col items-center space-y-8">
        <div className="w-full aspect-[3/4] max-h-[600px] border-4 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex items-center justify-center overflow-hidden relative transition-all hover:border-blue-400 group">
          {image ? (
            <img src={image} className="w-full h-full object-contain" alt="Preview" />
          ) : (
            <div className="text-center p-10">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-slate-600 font-bold text-lg">拖放或點擊上傳表單照片</p>
              <p className="text-slate-400 text-sm mt-2">支援 JPG, PNG, PDF 掃描檔</p>
            </div>
          )}
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <div className="flex space-x-4 w-full justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 font-bold transition-all shadow-sm"
          >
            選擇檔案
          </button>
          <button
            onClick={handleScan}
            disabled={!image || isProcessing}
            className={`px-12 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-200 transition-all ${
              (!image || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:scale-105 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                正在解析繁體中文資料...
              </span>
            ) : '開始 AI 自動填表'}
          </button>
        </div>

        {isProcessing && (
          <div className="w-full bg-blue-50 p-6 rounded-2xl flex items-start space-x-4 text-blue-700 border border-blue-100 animate-pulse">
             <div className="mt-1"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
             <div>
               <p className="font-bold">Gemini 正在理解表單內容</p>
               <p className="text-sm opacity-80 mt-1">我們正在提取姓名、身分證字號、聯絡地址與人事資料，辨識完成後您可以再次核對。</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRTool;
