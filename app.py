import gradio as gr
from google import genai
import os

# 2026 全新 Client 初始化語法
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

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
        return "請輸入內容。", ""
    if not client:
        return "系統錯誤：未偵測到 API 金鑰。", ""

    text_lower = text.lower()
    score = 0
    details_list = []

    for c in CRITERIA:
        found = any(kw in text_lower for kw in c["keywords"])
        if found: score += 1
        details_list.append(f"{'✅' if found else '❌'} {c['label']}")

    # 風險判定
    risk_level = "🔴 高風險"
    if score >= 5: risk_level = "🟢 低風險"
    elif score >= 3: risk_level = "🟡 中風險"

    try:
        # 2026 新版模型呼叫語法 (使用最新的 gemini-2.0-flash)
        response = client.models.generate_content(
            model='gemini-2.0-flash', 
            contents=f"你是一位犀利的審計專家。請分析這段文字的落地風險與貓膩：\n\n{text}"
        )
        ai_result = response.text
    except Exception as e:
        ai_result = f"AI 分析失敗：{str(e)}"

    summary = f"### 診斷結果：{risk_level}\n**指標得分：{score} / 6**\n\n" + "\n".join(details_list)
    return summary, ai_result

with gr.Blocks(title="文明病判定器 2026") as demo:
    gr.Markdown("# 🚀 文明病判定器 (2026 官方標準版)")
    with gr.Row():
        with gr.Column():
            input_box = gr.Textbox(label="輸入計畫描述", lines=10)
            btn = gr.Button("開始診斷", variant="primary")
        with gr.Column():
            res_summary = gr.Markdown(label="檢核結果")
            res_ai = gr.Markdown(label="🕵️ AI 深度稽核報告")
    btn.click(fn=analyze, inputs=input_box, outputs=[res_summary, res_ai])

demo.launch()
