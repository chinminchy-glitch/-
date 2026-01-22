
import React, { useState, useMemo } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, FileText, BarChart3, Copy, Check, Share2, Link as LinkIcon } from 'lucide-react';

interface Props {
  result: AnalysisResult;
  inputText: string;
}

const ResultDisplay: React.FC<Props> = ({ result, inputText }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // 預先計算分享網址
  const shareUrl = useMemo(() => {
    try {
      const baseUrl = window.location.href.split('?')[0];
      const params = new URLSearchParams();
      // 限制網址長度以確保在社群平台傳輸穩定 (約 1500 字元)
      const safeText = inputText.length > 1500 ? inputText.substring(0, 1500) : inputText;
      params.set('q', safeText);
      return `${baseUrl}?${params.toString()}`;
    } catch (e) {
      return window.location.href;
    }
  }, [inputText]);

  const getRiskUI = () => {
    switch (result.riskLevel) {
      case 'HIGH':
        return {
          color: 'bg-red-50 text-red-700 border-red-200',
          label: '🚨 極高風險（地基缺失：純屬空談）',
          bg: 'bg-red-500',
          desc: '此計畫嚴重缺乏執行細節，極大機率淪為口號。'
        };
      case 'MEDIUM':
        return {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          label: '🟡 中風險（架構不全：存在貓膩）',
          bg: 'bg-amber-500',
          desc: '計畫具備初步構思，但關鍵環節（如責任或時程）仍顯模糊。'
        };
      case 'LOW':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: '🟢 低風險（結構紮實：高度可行）',
          bg: 'bg-emerald-500',
          desc: '具備具體的執行框架與當責意識，落地成功率高。'
        };
    }
  };

  const riskUI = getRiskUI();

  const formatCleanReport = (text: string) => {
    if (!text) return "";
    return text.replace(/[#*]/g, '');
  };

  const handleCopyReport = () => {
    if (result.aiAnalysis) {
      const cleanText = formatCleanReport(result.aiAnalysis);
      navigator.clipboard.writeText(cleanText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const radius = 40;
  const stroke = 8;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Risk Banner */}
      <div className={`p-6 rounded-2xl border ${riskUI.color} shadow-sm`}>
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-2">
          {riskUI.label}
        </h2>
        <p className="opacity-90 leading-relaxed text-sm md:text-base">{riskUI.desc}</p>
      </div>

      {/* 專屬分享連結區塊 */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 md:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-indigo-700">
          <Share2 size={18} />
          <h3 className="font-bold text-sm">分享此分析結果</h3>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-indigo-300">
              <LinkIcon size={14} />
            </div>
            <input 
              readOnly 
              value={shareUrl}
              className="w-full bg-white border border-indigo-200 rounded-xl py-2.5 pl-9 pr-3 text-xs text-indigo-400 font-mono outline-none focus:border-indigo-400 transition-colors"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
          <button 
            onClick={handleShareLink}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 shrink-0
              ${shared ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}
            `}
          >
            {shared ? <Check size={16} /> : <Copy size={16} />}
            <span className="hidden sm:inline">{shared ? '已複製' : '複製連結'}</span>
          </button>
        </div>
        <p className="text-[10px] text-indigo-400 mt-2 italic">
          * 任何人點開此連結，系統將會自動載入並重新進行落地性稽核。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center min-h-[180px]">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <BarChart3 size={12} /> 落地指標得分
          </h3>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 overflow-visible">
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth={stroke}
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="currentColor"
                strokeWidth={stroke}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * result.score) / result.maxScore}
                className={`${riskUI.bg} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-0.5">
              <span className="text-2xl font-black text-slate-800 leading-none">
                {result.score}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                / {result.maxScore}
              </span>
            </div>
          </div>
        </div>

        {/* Heuristic Checklist */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            執行力核心維度檢核
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.details.map((item) => (
              <div
                key={item.key}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                  item.found ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-70'
                }`}
              >
                {item.found ? <CheckCircle2 size={16} className="shrink-0" /> : <XCircle size={16} className="shrink-0" />}
                <span className="font-bold text-xs md:text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Deep Report */}
      {result.aiAnalysis && (
        <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-white" size={20} />
              <h3 className="text-white font-bold text-lg tracking-wide">🕵️ AI 專家深度稽核報告</h3>
            </div>
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? '已複製' : '複製文字報告'}
            </button>
          </div>
          <div className="p-8">
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
              <div className="whitespace-pre-wrap font-sans text-sm md:text-base selection:bg-indigo-500/30">
                {formatCleanReport(result.aiAnalysis)}
              </div>
            </div>
          </div>
          <div className="px-8 pb-8">
            <div className="p-4 bg-indigo-950/40 border border-indigo-900/50 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="text-indigo-400 shrink-0 mt-1" size={18} />
              <p className="text-xs text-indigo-300/80 italic leading-relaxed">
                稽核聲明：本分析由 Gemini AI 透過先進語意邏輯推理產生。結果反映計畫內容的結構性風險，僅供決策參考，建議結合內部實地訪談與財務精算以獲得最精準的評估。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
