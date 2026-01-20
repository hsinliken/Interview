
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("找不到 root 節點，請檢查 index.html");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React 渲染失敗:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: sans-serif;">
        <h1>應用程式啟動失敗</h1>
        <p>${error instanceof Error ? error.message : String(error)}</p>
        <p>請檢查控制台 (Console) 以獲取更多細節。</p>
      </div>
    `;
  }
}
