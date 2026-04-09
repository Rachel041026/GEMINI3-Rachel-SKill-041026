import React, { useState, useEffect, useCallback } from 'react';
import { 
  Theme, Language, Agent, LogEntry, PainterStyle, ModelConfig, APIKeys 
} from './types';
import { AGENTS, STYLE_CONFIGS, TRANSLATIONS } from './lib/constants';
import { generateAIResponse } from './lib/gemini';
import { cn } from './lib/utils';
import { 
  Moon, Sun, LayoutDashboard, FileText, Zap, Settings, 
  Activity, Terminal, ShieldCheck, AlertCircle, Info, CheckCircle2,
  Cpu, Settings2, Key, MessageSquare, Download, Play, Wand2, Sparkles, Layout,
  Wand
} from 'lucide-react';

// Components
import { PainterStyleEngine } from './components/PainterStyleEngine';
import { AgentPulseMap } from './components/AgentPulseMap';
import { LiveLog } from './components/LiveLog';
import { Dashboard } from './components/Dashboard';
import { AINoteKeeper } from './components/AINoteKeeper';
import { SkillCreator } from './components/SkillCreator';
import { ModelLab } from './components/ModelLab';
import { LanguageToggle } from './components/LanguageToggle';
import { ReviewGenerator } from './components/ReviewGenerator';
import { SubmissionForm } from './components/SubmissionForm';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { TooltipProvider } from './components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { ScrollArea } from './components/ui/scroll-area';

export default function App() {
  // UI State
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('zh');
  const [painterStyle, setPainterStyle] = useState<PainterStyle>('Default');
  const [activeTab, setActiveTab] = useState('dashboard');

  const t = TRANSLATIONS[language];

  // App Data State
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    gemini: process.env.GEMINI_API_KEY || '',
  });
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    provider: 'google',
    model: 'gemini-3-flash-preview',
    prompt: 'You are an expert FDA 510(k) reviewer. Your goal is to ensure medical device safety and substantial equivalence.',
  });

  const [dataset, setDataset] = useState<any[]>([]);
  const [formQuestions, setFormQuestions] = useState<string[]>([]);

  // Helper to add logs
  const addLog = useCallback((agentName: string, message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      agentName,
      message,
      type,
    };
    setLogs(prev => [...prev.slice(-99), newLog]);
  }, []);

  // Simulate Agent Activity
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAgentIdx = Math.floor(Math.random() * agents.length);
      const randomAgent = agents[randomAgentIdx];
      
      if (randomAgent.status === 'idle') {
        setAgents(prev => prev.map((a, i) => i === randomAgentIdx ? { ...a, status: 'active' } : a));
        addLog(randomAgent.name, `Initiating task: ${randomAgent.role}...`, 'info');
        
        setTimeout(() => {
          setAgents(prev => prev.map((a, i) => i === randomAgentIdx ? { ...a, status: 'complete' } : a));
          addLog(randomAgent.name, `Task completed successfully.`, 'success');
        }, 3000 + Math.random() * 5000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [agents, addLog]);

  // AI Magic Handler
  const handleMagic = async (magicType: string, content: string): Promise<string> => {
    addLog('Magic Specialist', `Applying ${magicType} magic to content...`, 'info');
    
    const prompt = `
      Perform the following AI Magic: ${magicType}
      Content: ${content}
      
      If magicType is 'coralize', wrap critical regulatory keywords in <span className="coral-keyword">Keyword</span>.
      Return the result in Markdown format.
    `;

    try {
      const result = await generateAIResponse(
        { ...modelConfig, prompt },
        apiKeys,
        modelConfig.prompt
      );
      addLog('Magic Specialist', `${magicType} magic applied successfully.`, 'success');
      return result;
    } catch (error) {
      addLog('Magic Specialist', `Error applying magic: ${error}`, 'error');
      return `Error: ${error}`;
    }
  };

  // Skill Creator Handler
  const handleSkillTransform = async (doc: string, skill: string) => {
    addLog('Skill Architect', 'Transforming raw skill.md into standardized schema...', 'info');
    
    const prompt = `
      User Document: ${doc}
      Raw Skill: ${skill}
      
      1. Transform the raw skill into a standardized skill.md schema (Name, Version, Trigger, Logic, Template).
      2. Add 3 "WOW" sub-features to this skill.
      3. Generate 20 comprehensive follow-up questions for the reviewer.
      
      Return as JSON: { "standardized": "markdown string", "questions": ["q1", "q2", ...] }
    `;

    try {
      const result = await generateAIResponse(
        { ...modelConfig, prompt },
        apiKeys,
        "You are a Skill Architect Agent."
      );
      
      // Attempt to parse JSON from result (Gemini might wrap it in code blocks)
      const jsonStr = result.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      addLog('Skill Architect', 'Skill standardized and enhanced with 3 WOW features.', 'success');
      return parsed;
    } catch (error) {
      addLog('Skill Architect', 'Failed to standardize skill. Using fallback.', 'error');
      return {
        standardized: `# Standardized Skill\n\n${skill}\n\n## WOW Features\n1. Real-time Risk Detection\n2. Automated Guidance Cross-Ref\n3. Predictive Failure Analysis`,
        questions: Array.from({ length: 20 }, (_, i) => `Follow-up question ${i + 1} regarding the regulatory impact of this skill.`)
      };
    }
  };

  const handleSkillExecute = async (doc: string, skill: string) => {
    addLog('Skill Architect', 'Executing standardized skill on document...', 'info');
    const prompt = `Apply this skill: ${skill}\nTo this document: ${doc}`;
    return await generateAIResponse(modelConfig, apiKeys, prompt);
  };

  const style = STYLE_CONFIGS[painterStyle];

  return (
    <TooltipProvider>
      <div className={cn(
        "min-h-screen transition-all duration-500",
        theme === 'dark' ? "dark bg-[#0a0a0a] text-white" : "bg-[#f5f5f5] text-black",
        style.font,
        style.bg,
        style.text
      )}>
        {/* Header */}
        <header className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-md px-6 py-3 flex items-center justify-between",
          style.border
        )}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase">ORICKS v4.0</h1>
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Advanced 35-Agent FDA Review System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle language={language} onLanguageChange={setLanguage} />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.systemOnline}</span>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-[1600px] mx-auto grid grid-cols-12 gap-6">
          {/* Left Sidebar: Controls & Pulse Map */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <PainterStyleEngine currentStyle={painterStyle} onStyleChange={setPainterStyle} t={t} />
            <AgentPulseMap agents={agents} t={t} />
            <ModelLab 
              config={modelConfig} 
              onConfigChange={setModelConfig} 
              apiKeys={apiKeys} 
              onKeysChange={setApiKeys} 
              t={t}
            />
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6 h-12">
                <TabsTrigger value="dashboard" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden xl:inline">{t.dashboard}</span>
                </TabsTrigger>
                <TabsTrigger value="generator" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden xl:inline">{t.generateReview}</span>
                </TabsTrigger>
                <TabsTrigger value="form" className="gap-2">
                  <Layout className="w-4 h-4" />
                  <span className="hidden xl:inline">{t.submissionForm}</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden xl:inline">{t.noteKeeper}</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="hidden xl:inline">{t.skillCreator}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="space-y-6">
                <Dashboard />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        Adversarial Red Team Sim
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs opacity-80 italic">
                      "Devil's Advocate agents are currently simulating a rejection scenario for the biocompatibility section. 3 potential vulnerabilities identified."
                    </CardContent>
                  </Card>
                  <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Future-Proof Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs opacity-80 italic">
                      "Analyzing against Draft Guidance 2026-B. Warning: Proposed changes to software validation requirements may impact this submission in Q4."
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="generator">
                <ReviewGenerator 
                  apiKeys={apiKeys} 
                  modelConfig={modelConfig} 
                  t={t} 
                  addLog={addLog}
                  onDatasetGenerated={(data, questions) => {
                    setDataset(data);
                    setFormQuestions(questions);
                  }}
                  onSkillCreated={(skill) => addLog('Skill Architect', 'New Skill.md generated and ready for use.', 'success')}
                />
              </TabsContent>

              <TabsContent value="form">
                <SubmissionForm dataset={dataset} questions={formQuestions} onUpdate={setDataset} t={t} />
              </TabsContent>

              <TabsContent value="notes">
                <AINoteKeeper onMagic={handleMagic} t={t} />
              </TabsContent>

              <TabsContent value="skills">
                <SkillCreator onTransform={handleSkillTransform} onExecute={handleSkillExecute} t={t} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar: Live Log */}
          <div className="col-span-12 lg:col-span-3 h-[800px]">
            <LiveLog logs={logs} t={t} />
          </div>
        </main>

        {/* Footer Status Bar */}
        <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 px-6 py-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest z-50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="opacity-50">CPU:</span>
              <span className="text-green-500">12%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-50">MEM:</span>
              <span className="text-green-500">4.2GB / 32GB</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-50">UPTIME:</span>
              <span className="text-blue-500">04:12:55</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Hugging Face Space: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span>YAML Config: agents.v3.yaml</span>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
