import gradio as gr
import google.generativeai as genai
import os

# 確保從 Hugging Face Secrets 正確讀取金鑰
api_key = os.environ.get("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
else:
    print("警告：未偵測到 GEMINI_API_KEY，請檢查 Space Settings 中的 Secrets 設定。")

# 定義判斷指標 (對應你程式碼中的 ASSESSMENT_CRITERIA)
CRITERIA = [
    {"key": "implementation_steps", "label": "落地步驟", "keywords": ["步驟", "階段", "實施", "roadmap", "phase", "step", "plan", "流程", "時程"]},
    {"key": "accountability", "label": "責任歸屬", "keywords": ["責任", "承擔", "負責", "accountable", "負責人", "單位", "歸屬"]},
    {"key": "cost", "label": "成本代價", "keywords": ["成本", "付出", "代價", "負擔", "資源", "expense", "預算", "人力", "億元"]},
    {"key": "metrics", "label": "衡量指標", "keywords": ["指標", "衡量", "評估", "kpi", "數據", "metric", "檢驗", "達成率", "量化"]},
    {"key": "feedback", "label": "反饋機制", "keywords": ["修正", "反饋", "調整", "review", "feedback", "優化", "回饋"]},
    {"key": "sequence", "label": "執行順序", "keywords": ["順序", "先", "後", "接續", "next", "follow", "優先級", "排程"]}
]

def analyze(text):
    if not text or not text.strip():
        return "請輸入至少一些文字內容以供分析。", ""

    # 修正：Python 使用 .lower() 而非 .toLowerCase()
    text_lower = text.lower()
    score = 0
    details_list = []

    # 1. 本地邏輯掃描
    for c in CRITERIA:
        found = any(kw in text_lower for kw in c["keywords"])
        if found: score += 1
        status = "✅" if found else "❌"
        details_list.append(f"{status} {c['label']}")
   
    # 2. 風險等級判定 (完全複製你 React 中的邏輯)
    has_steps = any(kw in text_lower for kw in CRITERIA[0]["keywords"])
    has_accountability = any(kw in text_lower for kw in CRITERIA[1]["keywords"])
    
    risk_level = "🔴 高風險 (HIGH)"
    if has_steps and has_accountability and score >= 5:
        risk_level = "🟢 低風險 (LOW)"
    elif has_steps and score >= 3:
        risk_level = "🟡 中風險 (MEDIUM)"

    # 3. AI 深度分析
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        ai_prompt = f"你是一位犀利的審計專家。請分析以下文字的貓膩與落地風險：\n\n{text}"
        response = model.generate_content(ai_prompt)
        ai_result = response.text
    except Exception as e:
        ai_result = f"AI 分析失敗：{str(e)}"

    summary = f"### 診斷結果：{risk_level}\n**落地指標得分：{score} / 6**\n\n" + "\n".join(details_list)
    return summary, ai_result

# 建立 Gradio 介面
with gr.Blocks(title="文明病判定器") as demo:
    gr.Markdown("# 🚀 文明病判定器")
    gr.Markdown("打造「言必行、行必果」的當責文化")
    
    with gr.Row():
        with gr.Column():
            input_box = gr.Textbox(label="輸入計畫或政策描述", lines=10, placeholder="請貼入欲分析的文字...")
            btn = gr.Button("開始診斷落地風險", variant="primary")
        
        with gr.Column():
            res_summary = gr.Markdown(label="初步檢核")
            res_ai = gr.Markdown(label="🕵️ AI 專家深度稽核報告")

    btn.click(fn=analyze, inputs=input_box, outputs=[res_summary, res_ai])

demo.launch()
