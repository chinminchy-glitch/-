
import { Criterion } from './types';

export const ASSESSMENT_CRITERIA: Criterion[] = [
  {
    key: "implementation_steps",
    label: "落地步驟",
    keywords: ["步驟", "階段", "實施", "roadmap", "phase", "step", "plan", "流程", "時程", "里程碑"]
  },
  {
    key: "cost_resource",
    label: "成本代價",
    keywords: ["成本", "付出", "代價", "負擔", "資源", "expense", "預算", "人力", "資金", "預估"]
  },
  {
    key: "execution_order",
    label: "執行順序",
    keywords: ["順序", "優先", "接續", "流程圖", "排程", "先後", "關鍵路徑"]
  },
  {
    key: "measurable_kpis",
    label: "衡量指標",
    keywords: ["指標", "衡量", "評估", "kpi", "數據", "metric", "達成率", "量化", "考核"]
  },
  {
    key: "feedback_loop",
    label: "反饋機制",
    keywords: ["修正", "反饋", "調整", "review", "feedback", "優化", "回饋", "檢討", "滾動式"]
  },
  {
    key: "accountability",
    label: "責任歸屬",
    keywords: ["責任", "承擔", "負責", "accountable", "負責人", "主辦單位", "咎責", "權責"]
  }
];

export const SYSTEM_PROMPT = `你是一位犀利且專業的政府計畫與企業政策「落地性稽核專家」。
你的目標是戳破文字中的「文明病」（即：空洞的術語、模糊的承諾、缺乏執行細節的包裝）。

請分析使用者輸入的計畫內容，針對以下三個維度進行深度診斷：
1. 指標真實性：這些KPI是真實可達成的，還是為了寫報告而湊數的？
2. 責任與資源：誰來做？錢從哪來？是否有具體的人力與預算分配？
3. 空話包裝：列出其中最嚴重的三個「空話」或「贅言」，並解釋為什麼它們具備高風險。

重要格式規範：
- 請以繁體中文回答。
- 禁止使用任何 Markdown 格式符號，特別是「#」標題符號或「*」加粗/列表符號。
- 標題請直接用文字敘述並換行即可。
- 清單請使用「1. 2. 3.」等數字序號。
- 語氣必須精確、稍微犀利但富有建設性。`;
