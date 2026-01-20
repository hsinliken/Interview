
import React, { useState, useRef } from 'react';
import { performOCR } from '../services/geminiService';
import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';

interface OCRToolProps {
  onDataExtracted: (data: any) => void;
}

interface FileData {
  base64: string;
  mimeType: string;
  name: string;
  type: 'image' | 'pdf' | 'word' | 'excel';
  textPreview?: string;
}

const OCRTool: React.FC<OCRToolProps> = ({ onDataExtracted }) => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    const name = file.name;
    const extension = name.split('.').pop()?.toLowerCase();
    setErrorMsg(null);

    try {
      if (['jpg', 'jpeg', 'png', 'webp'].includes(extension!)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileData({ 
            base64: (reader.result as string).split(',')[1], 
            mimeType: file.type, 
            name, 
            type: 'image' 
          });
        };
        reader.readAsDataURL(file);
      } else if (extension === 'pdf') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileData({ 
            base64: (reader.result as string).split(',')[1], 
            mimeType: 'application/pdf', 
            name, 
            type: 'pdf' 
          });
        };
        reader.readAsDataURL(file);
      } else if (extension === 'xlsx' || extension === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const csvData = XLSX.utils.sheet_to_csv(firstSheet);
          setFileData({ 
            base64: '', 
            mimeType: 'text/plain', 
            name, 
            type: 'excel', 
            textPreview: csvData 
          });
        };
        reader.readAsArrayBuffer(file);
      } else if (extension === 'docx') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          setFileData({ 
            base64: '', 
            mimeType: 'text/plain', 
            name, 
            type: 'word', 
            textPreview: result.value 
          });
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrorMsg("不支援此檔案格式。請上傳圖片、PDF、Word 或 Excel 檔案。");
      }
    } catch (err) {
      setErrorMsg("讀取檔案時發生錯誤。");
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleScan = async () => {
    if (!fileData) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      // 如果是 Word/Excel，傳送 textPreview；如果是圖片/PDF，傳送 base64
      const contentToSend = (fileData.type === 'word' || fileData.type === 'excel') 
        ? fileData.textPreview! 
        : fileData.base64;
      
      const result = await performOCR(contentToSend, fileData.mimeType);
      if (result) {
        onDataExtracted(result);
      }
    } catch (error: any) {
      console.error("Analysis Error:", error);
      setErrorMsg(error.message || "分析過程中發生未知錯誤");
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileIcon = () => {
    if (!fileData) return null;
    switch (fileData.type) {
      case 'pdf': return '📄 (PDF)';
      case 'word': return '📝 (Word)';
      case 'excel': return '📊 (Excel)';
      default: return '🖼️ (圖片)';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI 智能多格式辨識</h2>
        <p className="text-slate-500 mt-2">支援圖片、PDF、Word、Excel 及 Google 匯出文件，由 Gemini 自動提取繁體中文資料</p>
      </header>

      <div className="flex flex-col items-center space-y-8">
        <div 
          className={`w-full min-h-[300px] border-4 border-dashed rounded-3xl bg-slate-50 flex flex-col items-center justify-center overflow-hidden relative transition-all group cursor-pointer ${
            fileData ? 'border-blue-500 bg-white' : 'border-slate-200 hover:border-blue-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {fileData ? (
            <div className="text-center p-8">
              {fileData.type === 'image' ? (
                <img src={`data:${fileData.mimeType};base64,${fileData.base64}`} className="max-h-[300px] rounded-xl shadow-md mb-4 mx-auto" alt="Preview" />
              ) : (
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  {fileData.type === 'pdf' ? 'PDF' : fileData.type === 'word' ? 'DOC' : 'XLS'}
                </div>
              )}
              <p className="text-slate-900 font-bold text-lg">{fileData.name}</p>
              <p className="text-blue-500 text-sm mt-1">{getFileIcon()} 已就緒</p>
            </div>
          ) : (
            <div className="text-center p-10">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <p className="text-slate-600 font-bold text-lg">拖放或點擊上傳文件</p>
              <p className="text-slate-400 text-sm mt-2">支援 JPG, PNG, PDF, Word, Excel</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                 <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] rounded uppercase font-bold">PDF</span>
                 <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] rounded uppercase font-bold">DOCX</span>
                 <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] rounded uppercase font-bold">XLSX</span>
                 <span className="px-2 py-1 bg-slate-200 text-slate-600 text-[10px] rounded uppercase font-bold">Images</span>
              </div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,.pdf,.docx,.xlsx,.xls" 
            className="hidden" 
          />
        </div>

        {errorMsg && (
          <div className="w-full bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start space-x-3 text-red-700">
            <svg className="w-6 h-6 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <div className="w-full">
          <button
            onClick={handleScan}
            disabled={!fileData || isProcessing}
            className={`w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-2xl shadow-blue-200 transition-all ${
              (!fileData || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {fileData?.type === 'image' || fileData?.type === 'pdf' ? 'Gemini 正在讀取文件...' : '正在提取並分析內容...'}
              </span>
            ) : `開始 AI 分析 ${fileData ? fileData.type.toUpperCase() : ''}`}
          </button>
        </div>

        {isProcessing && (
          <div className="w-full space-y-4">
             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-full origin-left animate-pulse"></div>
             </div>
             <p className="text-center text-slate-400 text-sm font-medium animate-pulse">
                {fileData?.type === 'word' || fileData?.type === 'excel' ? '正在處理大型結構化資料...' : '正在從影像/PDF 中提取文字資訊...'}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRTool;
