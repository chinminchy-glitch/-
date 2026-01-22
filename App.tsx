
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ASSESSMENT_CRITERIA } from './constants';
import { AnalysisResult } from './types';
import { analyzeWithAI } from './services/geminiService';
import Header from './components/Header';
import ResultDisplay from './components/ResultDisplay';
import { Search, AlertCircle, Loader2, Rocket } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasAutoRun = useRef(false);

  const performAnalysis = useCallback(async (textToAnalyze?: string) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) {
      setError("請輸入至少一些文字內容以供分析。");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    // 安全地更新 URL 方便分享 (避免在 Blob URL 環境下崩潰)
    try {
      const isBlob = window.location.protocol === 'blob:';
      if (!isBlob && window.history.replaceState) {
        const params = new URLSearchParams(window.location.search);
        // 限制 URL 長度，避免瀏覽器限制導致的錯誤 (約 2000 字元)
        const shortenedText = text.length > 1500 ? text.substring(0, 1500) + "..." : text;
        params.set('q', shortenedText);
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      }
    } catch (e) {
      console.warn("無法更新網址列狀態:", e);
    }

    try {
      const textLower = text.toLowerCase();
      let score = 0;
      const details = ASSESSMENT_CRITERIA.map(criterion => {
        const found = criterion.keywords.some(kw => textLower.includes(kw));
        if (found) score++;
        return {
          key: criterion.key,
          label: criterion.label,
          found
        };
      });

      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH';
      const hasSteps = details.find(d => d.key === 'implementation_steps')?.found;
      const hasAccountability = details.find(d => d.key === 'accountability')?.found;

      if (hasSteps && hasAccountability && score >= 5) {
        riskLevel = 'LOW';
      } else if (hasSteps && score >= 3) {
        riskLevel = 'MEDIUM';
      }

      const aiResponse = await analyzeWithAI(text);

      setResult({
        score,
        maxScore: ASSESSMENT_CRITERIA.length,
        details,
        riskLevel,
        aiAnalysis: aiResponse
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "分析過程中發生錯誤，請稍後再試。");
    } finally {
      setIsAnalyzing(false);
    }
  }, [inputText]);

  // 初始化讀取 URL 參數
  useEffect(() => {
    if (hasAutoRun.current) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q');
      if (query) {
        setInputText(query);
        performAnalysis(query);
      }
    } catch (e) {
      console.error("讀取 URL 參數失敗:", e);
    }
    hasAutoRun.current = true;
  }, [performAnalysis]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Header />

      <main className="space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Search size={18} className="text-indigo-600" />
            輸入計畫或政策描述
          </label>
          <textarea
            className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none text-slate-800 leading-relaxed"
            placeholder="請輸入欲分析的計畫描述，例如：DEI 多元共融政策推動計畫、公司數位轉型方案、地方教育改革白皮書..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <button
            onClick={() => performAnalysis()}
            disabled={isAnalyzing || !inputText.trim()}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all
              ${isAnalyzing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}
            `}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" />
                正在進行深度稽核分析...
              </>
            ) : (
              <>
                <Rocket size={20} />
                開始診斷落地風險
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && <ResultDisplay result={result} inputText={inputText} />}
      </main>

      <footer className="mt-20 text-center text-slate-400 text-sm">
        <p>© 2025 文明病判定器 - 打造「言必行、行必果」的當責文化</p>
      </footer>
    </div>
  );
};

export default App;
