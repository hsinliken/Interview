
import React, { useState } from 'react';
import { queryHRAIData } from '../services/geminiService';
import { Employee } from '../types';

interface SmartAnalyticsProps {
  employees: Employee[];
}

const SmartAnalytics: React.FC<SmartAnalyticsProps> = ({ employees }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsThinking(true);
    setResponse(null);
    try {
      const result = await queryHRAIData(query, employees);
      setResponse(result || "找不到相關數據的洞察報告。");
    } catch (error) {
      setResponse("抱歉，在分析數據時發生錯誤。");
    } finally {
      setIsThinking(false);
    }
  };

  const suggestedQueries = [
    "幫我總結目前的報到進度。",
    "哪一個部門的新進人數最多？",
    "列出所有客服專員的姓名與到職日。",
    "分析新進員工的薪資分佈情況。"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900">智慧數據洞察</h1>
        <p className="text-slate-500 mt-1">使用自然語言詢問 Gemini 關於人事數據的問題</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[700px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
          {response ? (
            <div className="space-y-6">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl rounded-tr-none shadow-lg max-w-[80%] font-medium">
                  {query}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white text-slate-800 px-8 py-6 rounded-3xl rounded-tl-none border border-slate-200 shadow-md max-w-[90%] relative">
                  <div className="font-black text-xs text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                    <div className="bg-blue-100 p-1 rounded-md mr-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    Gemini AI 數據助理
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-10">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">今天想了解什麼數據？</h3>
              <p className="text-slate-500 max-w-sm mb-12">您可以詢問關於員工分佈、薪資統計或入職進度的任何問題。</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {suggestedQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setQuery(q); }}
                    className="text-left p-4 bg-white hover:bg-blue-50 border border-slate-200 rounded-2xl text-slate-700 font-bold transition-all hover:border-blue-400 shadow-sm"
                  >
                    「{q}」
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {isThinking && (
            <div className="flex justify-start">
               <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
                 <div className="flex space-x-1">
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                 </div>
                 <span className="text-sm text-slate-500 font-bold tracking-widest">正在分析數據...</span>
               </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-white">
          <form onSubmit={handleAsk} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="請輸入您的問題..."
              className="w-full pl-6 pr-16 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-lg font-medium shadow-sm"
            />
            <button
              disabled={isThinking || !query.trim()}
              className="absolute right-3 top-3 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SmartAnalytics;
