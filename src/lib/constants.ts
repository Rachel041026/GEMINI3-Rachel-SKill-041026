import { Agent, PainterStyle } from '../types';

export const AGENTS: Agent[] = [
  // Intake Squad (1-5)
  { id: 1, name: 'Master Coordinator', role: 'Orchestration', status: 'idle', group: 'Intake', description: 'Parses user requests and routes tasks.' },
  { id: 2, name: 'Doc Parser Alpha', role: 'OCR & Extraction', status: 'idle', group: 'Intake', description: 'Extracts text from complex PDFs.' },
  { id: 3, name: 'Metadata Extractor', role: 'Data Structuring', status: 'idle', group: 'Intake', description: 'Identifies key submission metadata.' },
  { id: 4, name: 'Image Analyzer', role: 'Visual Review', status: 'idle', group: 'Intake', description: 'Analyzes diagrams and clinical photos.' },
  { id: 5, name: 'Intake Validator', role: 'Completeness Check', status: 'idle', group: 'Intake', description: 'Ensures all required files are present.' },
  
  // Technical Core (6-15)
  { id: 6, name: 'Software Auditor', role: 'Cybersecurity', status: 'idle', group: 'Technical', description: 'Reviews software lifecycle and security.' },
  { id: 7, name: 'Electrical Safety', role: 'IEC 60601', status: 'idle', group: 'Technical', description: 'Validates electrical safety standards.' },
  { id: 8, name: 'Biocompatibility', role: 'ISO 10993', status: 'idle', group: 'Technical', description: 'Evaluates material safety.' },
  { id: 9, name: 'Sterilization Pro', role: 'Validation', status: 'idle', group: 'Technical', description: 'Reviews sterilization protocols.' },
  { id: 10, name: 'Clinical Evaluator', role: 'Performance', status: 'idle', group: 'Technical', description: 'Analyzes clinical trial data.' },
  { id: 11, name: 'Usability Expert', role: 'Human Factors', status: 'idle', group: 'Technical', description: 'Reviews user interface and ergonomics.' },
  { id: 12, name: 'Risk Manager', role: 'ISO 14971', status: 'idle', group: 'Technical', description: 'Evaluates risk management files.' },
  { id: 13, name: 'Labeling Reviewer', role: 'Compliance', status: 'idle', group: 'Technical', description: 'Checks IFU and labeling accuracy.' },
  { id: 14, name: 'Shelf Life Analyst', role: 'Stability', status: 'idle', group: 'Technical', description: 'Reviews aging and stability studies.' },
  { id: 15, name: 'EMC Specialist', role: 'Interference', status: 'idle', group: 'Technical', description: 'Checks electromagnetic compatibility.' },

  // Regulatory Context (16-25)
  { id: 16, name: 'Predicate Matcher', role: 'Substantial Equivalence', status: 'idle', group: 'Regulatory', description: 'Compares device to predicates.' },
  { id: 17, name: 'Guidance Finder', role: 'FDA Policy', status: 'idle', group: 'Regulatory', description: 'Locates relevant FDA guidance docs.' },
  { id: 18, name: 'Classification Bot', role: 'Product Code', status: 'idle', group: 'Regulatory', description: 'Determines correct device class.' },
  { id: 19, name: 'Pre-Sub Historian', role: 'Context', status: 'idle', group: 'Regulatory', description: 'Reviews previous FDA interactions.' },
  { id: 20, name: 'MAUDE Scanner', role: 'Adverse Events', status: 'idle', group: 'Regulatory', description: 'Scans MAUDE database for issues.' },
  { id: 21, name: 'Standard Cross-Ref', role: 'ISO/ASTM', status: 'idle', group: 'Regulatory', description: 'Ensures compliance with global standards.' },
  { id: 22, name: 'De Novo Advisor', role: 'Pathway', status: 'idle', group: 'Regulatory', description: 'Evaluates De Novo suitability.' },
  { id: 23, name: 'PMA Consultant', role: 'High Risk', status: 'idle', group: 'Regulatory', description: 'Advises on Class III requirements.' },
  { id: 24, name: 'QMS Auditor', role: '21 CFR 820', status: 'idle', group: 'Regulatory', description: 'Checks quality system compliance.' },
  { id: 25, name: 'Summary Writer', role: 'Reporting', status: 'idle', group: 'Regulatory', description: 'Generates final review summaries.' },

  // WOW Specialists (26-35)
  { id: 26, name: 'Adversarial Red Team', role: 'Devil\'s Advocate', status: 'idle', group: 'WOW', description: 'Attempts to find reasons for rejection.' },
  { id: 27, name: 'Future-Proof Analyst', role: 'Predictive', status: 'idle', group: 'WOW', description: 'Analyzes against draft guidances.' },
  { id: 28, name: 'Ghosting Engine', role: 'Visual Comparison', status: 'idle', group: 'WOW', description: 'Generates visual predicate overlays.' },
  { id: 29, name: 'Skill Architect', role: 'Extensibility', status: 'idle', group: 'WOW', description: 'Transforms raw skills into standardized ones.' },
  { id: 30, name: 'Magic Summarizer', role: 'Synthesis', status: 'idle', group: 'WOW', description: 'Condenses complex findings.' },
  { id: 31, name: 'Gap Illuminator', role: 'Detection', status: 'idle', group: 'WOW', description: 'Highlights missing regulatory elements.' },
  { id: 32, name: 'Citation Wizard', role: 'Evidence', status: 'idle', group: 'WOW', description: 'Automates regulatory citations.' },
  { id: 33, name: 'Tone Transformer', role: 'Communication', status: 'idle', group: 'WOW', description: 'Adjusts tone for official letters.' },
  { id: 34, name: 'Risk Mapper', role: 'Visualization', status: 'idle', group: 'WOW', description: 'Translates notes into risk tables.' },
  { id: 35, name: 'Keyword Coralizer', role: 'Emphasis', status: 'idle', group: 'WOW', description: 'Highlights critical regulatory terms.' },
];

export const PAINTER_STYLES: PainterStyle[] = [
  'Default', 'Van Gogh', 'Picasso', 'Monet', 'Dali', 
  'Basquiat', 'Hokusai', 'Banksy', 'Warhol', 'Kahlo', 
  'Rembrandt', 'Vermeer', 'Klimt', 'Mondrian', 'Pollock', 
  'Matisse', 'Munch', 'Hopper', 'O\'Keeffe', 'Lichtenstein', 'Kusama'
];

export const STYLE_CONFIGS: Record<PainterStyle, { bg: string; text: string; accent: string; font: string; border: string }> = {
  'Default': { bg: 'bg-background', text: 'text-foreground', accent: 'bg-primary', font: 'font-sans', border: 'border-border' },
  'Van Gogh': { bg: 'bg-[#1a2a6c]', text: 'text-[#fdbb2d]', accent: 'bg-[#b21f1f]', font: 'font-serif', border: 'border-[#fdbb2d]/50' },
  'Picasso': { bg: 'bg-[#e0e0e0]', text: 'text-[#333]', accent: 'bg-[#ff5722]', font: 'font-mono', border: 'border-black border-2' },
  'Monet': { bg: 'bg-[#f0f4f8]', text: 'text-[#4a5568]', accent: 'bg-[#a0aec0]', font: 'font-serif', border: 'border-[#cbd5e0]' },
  'Dali': { bg: 'bg-[#2d3436]', text: 'text-[#dfe6e9]', accent: 'bg-[#d63031]', font: 'font-serif', border: 'border-[#fdcb6e] rounded-tr-[50px] rounded-bl-[50px]' },
  'Basquiat': { bg: 'bg-[#111]', text: 'text-[#fff]', accent: 'bg-[#ffff00]', font: 'font-mono', border: 'border-[#fff] border-4 border-dashed' },
  'Hokusai': { bg: 'bg-[#fdfcf0]', text: 'text-[#1a365d]', accent: 'bg-[#2b6cb0]', font: 'font-serif', border: 'border-[#2b6cb0] border-b-8' },
  'Banksy': { bg: 'bg-[#333]', text: 'text-[#fff]', accent: 'bg-[#e53e3e]', font: 'font-mono', border: 'border-[#718096] border-2' },
  'Warhol': { bg: 'bg-[#ff00ff]', text: 'text-[#00ffff]', accent: 'bg-[#ffff00]', font: 'font-sans', border: 'border-[#000] border-8' },
  'Kahlo': { bg: 'bg-[#276749]', text: 'text-[#f6e05e]', accent: 'bg-[#9b2c2c]', font: 'font-serif', border: 'border-[#f6e05e]' },
  'Rembrandt': { bg: 'bg-[#2c1810]', text: 'text-[#d4af37]', accent: 'bg-[#8b4513]', font: 'font-serif', border: 'border-[#d4af37]/30' },
  'Vermeer': { bg: 'bg-[#0047ab]', text: 'text-[#f5deb3]', accent: 'bg-[#ffd700]', font: 'font-serif', border: 'border-[#f5deb3]' },
  'Klimt': { bg: 'bg-[#ffd700]', text: 'text-[#000]', accent: 'bg-[#000]', font: 'font-serif', border: 'border-black border-double' },
  'Mondrian': { bg: 'bg-[#fff]', text: 'text-[#000]', accent: 'bg-[#ff0000]', font: 'font-sans', border: 'border-black border-[10px]' },
  'Pollock': { bg: 'bg-[#000]', text: 'text-[#fff]', accent: 'bg-[#fff]', font: 'font-sans', border: 'border-white border-opacity-20' },
  'Matisse': { bg: 'bg-[#f6ad55]', text: 'text-[#2c5282]', accent: 'bg-[#38a169]', font: 'font-sans', border: 'border-[#2c5282] rounded-full' },
  'Munch': { bg: 'bg-[#4a5568]', text: 'text-[#fc8181]', accent: 'bg-[#2d3748]', font: 'font-serif', border: 'border-[#fc8181] border-opacity-50 skew-x-2' },
  'Hopper': { bg: 'bg-[#285e61]', text: 'text-[#e6fffa]', accent: 'bg-[#319795]', font: 'font-sans', border: 'border-[#e6fffa] border-l-4' },
  'O\'Keeffe': { bg: 'bg-[#fff5f5]', text: 'text-[#9b2c2c]', accent: 'bg-[#feb2b2]', font: 'font-serif', border: 'border-[#feb2b2] rounded-[100%]' },
  'Lichtenstein': { bg: 'bg-[#fff]', text: 'text-[#000]', accent: 'bg-[#ffff00]', font: 'font-sans', border: 'border-black border-4' },
  'Kusama': { bg: 'bg-[#ff0000]', text: 'text-[#fff]', accent: 'bg-[#000]', font: 'font-sans', border: 'border-white rounded-full' },
};

export const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    noteKeeper: "AI Note Keeper",
    skillCreator: "Skill Creator",
    systemOnline: "System Online",
    agentPulseMap: "Agent Pulse Map (35 Units)",
    liveReasoning: "ORICKS Live Reasoning Chain",
    modelSelection: "Model Selection",
    basePrompt: "Base Prompt Modifier",
    apiKeyMgmt: "API Key Management",
    spinForStyle: "SPIN FOR STYLE!",
    currentAesthetic: "Current Aesthetic",
    coralTransform: "Coral Transform",
    aiMagics: "AI Magics",
    standardizeSkill: "Transform to Standardized Skill.md",
    executeSkill: "Execute Skill on Document",
    followUpQuestions: "20 Comprehensive Follow-Up Questions",
    submissionIntake: "Submission Intake",
    reportTemplate: "Report Template",
    generateReview: "Generate 510(k) Review",
    webSummary: "Web Search Summary",
    fdaSummary: "510(k) Summary",
    dataset: "510(k) Dataset",
    reviewReport: "510(k) Review Report",
    submissionForm: "510(k) Submission Form",
    download: "Download",
    edit: "Edit",
    language: "Language",
    traditionalChinese: "Traditional Chinese",
    english: "English",
    startGeneration: "Start Generation Process",
  },
  zh: {
    dashboard: "儀表板",
    noteKeeper: "AI 筆記助手",
    skillCreator: "技能創造器",
    systemOnline: "系統在線",
    agentPulseMap: "代理脈搏圖 (35 單元)",
    liveReasoning: "ORICKS 即時推理鏈",
    modelSelection: "模型選擇",
    basePrompt: "基礎提示詞修改",
    apiKeyMgmt: "API 金鑰管理",
    spinForStyle: "旋轉切換風格！",
    currentAesthetic: "當前美學",
    coralTransform: "珊瑚色轉換",
    aiMagics: "AI 魔法",
    standardizeSkill: "轉換為標準化 Skill.md",
    executeSkill: "在文檔上執行技能",
    followUpQuestions: "20 個綜合追蹤問題",
    submissionIntake: "提交資料輸入",
    reportTemplate: "報告範本",
    generateReview: "生成 510(k) 審查",
    webSummary: "網路搜尋摘要",
    fdaSummary: "510(k) 摘要",
    dataset: "510(k) 數據集",
    reviewReport: "510(k) 審查報告",
    submissionForm: "510(k) 提交表單",
    download: "下載",
    edit: "編輯",
    language: "語言",
    traditionalChinese: "繁體中文",
    english: "英文",
    startGeneration: "開始生成流程",
  }
};

export const DEFAULT_REPORT_TEMPLATE = `510(k) 審查報告：[裝置名稱] ([510(k) 編號])
1. 執行摘要 (Executive Summary)
[內容]

2. 行政與分類資訊 (Administrative and Classification Information)
[內容]

3. 裝置描述 (Device Description)
[內容]

4. 適應症 (Indications for Use)
[內容]

5. 實質等效性比較 (Substantial Equivalence Discussion)
[內容]

6. 符合之共識標準 (Consensus Standards)
[內容]

7. 性能數據：軟體驗證與確認 (V&V)
[內容]

8. 詳細審查清單 (Detailed Review Checklist)
[內容]

9. 數據集中提取的 20 個關鍵實體 (Extracted Entities)
[內容]

10. 結論 (Conclusion)
[內容]

11. 後續審查追蹤問題 (20 Follow-up Questions)
[內容]`;

