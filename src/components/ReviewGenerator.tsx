import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  Search, FileText, Database, ClipboardCheck, Download, 
  Play, Loader2, Languages, FileJson, Wand2, Sparkles,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { generateAIResponse } from '../lib/gemini';
import { APIKeys, ModelConfig, Language, ReviewResults } from '../types';
import { DEFAULT_REPORT_TEMPLATE } from '../lib/constants';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewGeneratorProps {
  apiKeys: APIKeys;
  modelConfig: ModelConfig;
  t: any;
  addLog: (agent: string, msg: string, type?: 'info' | 'success' | 'error') => void;
  onSkillCreated?: (skillMd: string) => void;
  onDatasetGenerated?: (dataset: any[], questions: string[]) => void;
}

export const ReviewGenerator: React.FC<ReviewGeneratorProps> = ({ 
  apiKeys, modelConfig, t, addLog, onSkillCreated, onDatasetGenerated 
}) => {
  const [submissionContent, setSubmissionContent] = useState('');
  const [template, setTemplate] = useState(DEFAULT_REPORT_TEMPLATE);
  const [language, setLanguage] = useState<Language>('zh');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  const [results, setResults] = useState<ReviewResults>({
    webSummary: '',
    fdaSummary: '',
    dataset: [],
    report: '',
    skillMd: '',
    followUpQuestions: [],
    formQuestions: []
  });

  const steps = [
    { id: 1, name: t.webSummary, icon: Search, color: 'text-blue-500' },
    { id: 2, name: t.fdaSummary, icon: FileText, color: 'text-green-500' },
    { id: 3, name: t.dataset, icon: Database, color: 'text-purple-500' },
    { id: 4, name: t.reviewReport, icon: ClipboardCheck, color: 'text-orange-500' },
    { id: 5, name: 'Skill.md', icon: Wand2, color: 'text-pink-500' }
  ];

  const handleGenerate = async () => {
    if (!submissionContent) {
      addLog('System', 'Please provide submission content first.', 'error');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(1);
    addLog('Master Coordinator', 'Starting comprehensive 510(k) review generation...', 'info');

    try {
      // Step 1: Web Search Summary (2000-3000 words)
      addLog('Guidance Finder', 'Searching web for FDA guidance and similar 510(k) summaries...', 'info');
      const webSummary = await generateAIResponse(
        { 
          ...modelConfig, 
          prompt: `Search for FDA guidance and 510(k) summaries related to: ${submissionContent.substring(0, 500)}. 
          Create a comprehensive summary in ${language === 'zh' ? 'Traditional Chinese' : 'English'} (2000-3000 words). 
          Focus on regulatory requirements, predicate device trends, and common pitfalls.`,
          useSearch: true 
        },
        apiKeys
      );
      setResults(prev => ({ ...prev, webSummary }));
      setCurrentStep(2);

      // Step 2: 510(k) Summary (3000-4000 words)
      addLog('Summary Writer', 'Creating detailed 510(k) summary based on submission and guidance...', 'info');
      const fdaSummary = await generateAIResponse(
        { 
          ...modelConfig, 
          prompt: `Based on the user submission: ${submissionContent} 
          And the guidance summary: ${webSummary.substring(0, 2000)}
          Create a comprehensive 510(k) summary in ${language === 'zh' ? 'Traditional Chinese' : 'English'} (3000-4000 words). 
          Include technical descriptions, indications for use, and substantial equivalence arguments.`
        },
        apiKeys
      );
      setResults(prev => ({ ...prev, fdaSummary }));
      setCurrentStep(3);

      // Step 3: Dataset (JSON, 50 entities)
      addLog('Metadata Extractor', 'Extracting 50 key entities for dataset...', 'info');
      const datasetStr = await generateAIResponse(
        { 
          ...modelConfig, 
          prompt: `Extract 50 key entities (regulatory, technical, clinical) from this 510(k) summary: ${fdaSummary.substring(0, 3000)}. 
          Return as a JSON array of objects with { "entity": "name", "value": "description/value", "category": "technical|regulatory|clinical" }.`,
          responseMimeType: 'application/json'
        },
        apiKeys
      );
      const dataset = JSON.parse(datasetStr.replace(/```json|```/g, '').trim());
      
      // Generate 20 form questions
      const questionsStr = await generateAIResponse(
        {
          ...modelConfig,
          prompt: `Based on this dataset: ${JSON.stringify(dataset.slice(0, 10))}, generate 20 comprehensive follow-up questions for a 510(k) submission form. Return as a JSON array of strings.`,
          responseMimeType: 'application/json'
        },
        apiKeys
      );
      const formQuestions = JSON.parse(questionsStr.replace(/```json|```/g, '').trim());

      setResults(prev => ({ ...prev, dataset, formQuestions }));
      if (onDatasetGenerated) onDatasetGenerated(dataset, formQuestions);
      setCurrentStep(4);

      // Step 4: Review Report (3000-4000 words)
      addLog('Master Reviewer', 'Generating final 510(k) review report using template...', 'info');
      const report = await generateAIResponse(
        { 
          ...modelConfig, 
          prompt: `Using this template: ${template}
          And this data: ${JSON.stringify(dataset)}
          And these summaries: ${fdaSummary.substring(0, 2000)}
          Create a comprehensive 510(k) review report in ${language === 'zh' ? 'Traditional Chinese' : 'English'} (3000-4000 words).
          Include 5 tables, 20 entities, a review checklist, and end with 20 comprehensive follow-up questions.`
        },
        apiKeys
      );
      setResults(prev => ({ ...prev, report }));
      setCurrentStep(5);

      // Step 5: Skill.md
      addLog('Skill Architect', 'Creating Skill.md for similar devices...', 'info');
      const skillMd = await generateAIResponse(
        { 
          ...modelConfig, 
          prompt: `Create a standardized Skill.md based on the previous results for reviewing similar devices. 
          Include Name, Version, Trigger, Logic, and Template. 
          Add 3 additional WOW AI features to this skill (e.g., predictive risk scoring, automated predicate mapping).`
        },
        apiKeys
      );
      setResults(prev => ({ ...prev, skillMd }));
      if (onSkillCreated) onSkillCreated(skillMd);

      addLog('Master Coordinator', 'All generation steps completed successfully!', 'success');
      setCurrentStep(6);
    } catch (error) {
      addLog('System', `Generation failed: ${error}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              {t.submissionIntake}
            </CardTitle>
            <CardDescription>Paste 510(k) summary, notes, or guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Paste content here..." 
              className="min-h-[200px] font-mono text-xs"
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 opacity-50" />
                <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh">{t.traditionalChinese}</SelectItem>
                    <SelectItem value="en">{t.english}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !submissionContent}
                className="gap-2"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {t.startGeneration}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-orange-500" />
              {t.reportTemplate}
            </CardTitle>
            <CardDescription>Customize your review report structure</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="Paste template here..." 
              className="min-h-[200px] font-mono text-xs"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
            <Button variant="ghost" size="sm" className="mt-2 text-[10px]" onClick={() => setTemplate(DEFAULT_REPORT_TEMPLATE)}>
              Reset to Default
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicator */}
      {isGenerating && (
        <div className="flex items-center justify-center gap-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
          {steps.map((step) => (
            <div key={step.id} className={cn(
              "flex flex-col items-center gap-2 transition-all duration-300",
              currentStep >= step.id ? "opacity-100 scale-110" : "opacity-30 scale-90"
            )}>
              <div className={cn(
                "p-3 rounded-full border-2",
                currentStep > step.id ? "bg-green-500 border-green-500 text-white" : 
                currentStep === step.id ? "border-primary animate-pulse" : "border-muted"
              )}>
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className={cn("w-5 h-5", step.color)} />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{step.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Results Display */}
      <AnimatePresence>
        {currentStep > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Tabs defaultValue="report" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="web" disabled={!results.webSummary}>{t.webSummary}</TabsTrigger>
                <TabsTrigger value="fda" disabled={!results.fdaSummary}>{t.fdaSummary}</TabsTrigger>
                <TabsTrigger value="dataset" disabled={results.dataset.length === 0}>{t.dataset}</TabsTrigger>
                <TabsTrigger value="report" disabled={!results.report}>{t.reviewReport}</TabsTrigger>
                <TabsTrigger value="skill" disabled={!results.skillMd}>Skill.md</TabsTrigger>
              </TabsList>

              <TabsContent value="web">
                <ResultCard title={t.webSummary} content={results.webSummary} onDownload={() => downloadFile(results.webSummary, 'web_summary.md', 'text/markdown')} />
              </TabsContent>
              <TabsContent value="fda">
                <ResultCard title={t.fdaSummary} content={results.fdaSummary} onDownload={() => downloadFile(results.fdaSummary, 'fda_summary.md', 'text/markdown')} />
              </TabsContent>
              <TabsContent value="dataset">
                <Card className="bg-card/50 border-2 border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Database className="w-4 h-4 text-purple-500" />
                      {t.dataset} (50 Entities)
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={() => downloadFile(JSON.stringify(results.dataset, null, 2), 'dataset.json', 'application/json')}>
                      <Download className="w-4 h-4 mr-2" /> {t.download}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {results.dataset.map((item, idx) => (
                          <div key={idx} className="p-2 bg-muted/50 rounded border flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-primary">{item.entity}</span>
                              <Badge variant="outline" className="text-[8px]">{item.category}</Badge>
                            </div>
                            <span className="text-xs opacity-80">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="report">
                <ResultCard title={t.reviewReport} content={results.report} onDownload={() => downloadFile(results.report, 'review_report.md', 'text/markdown')} />
              </TabsContent>
              <TabsContent value="skill">
                <ResultCard title="Skill.md" content={results.skillMd} onDownload={() => downloadFile(results.skillMd, 'skill.md', 'text/markdown')} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultCard = ({ title, content, onDownload }: { title: string, content: string, onDownload: () => void }) => (
  <Card className="bg-card/50 border-2 border-primary/20">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-sm font-bold flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-yellow-500" />
        {title}
      </CardTitle>
      <Button size="sm" variant="outline" onClick={onDownload}>
        <Download className="w-4 h-4 mr-2" /> Download
      </Button>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[500px] w-full rounded-md border p-4">
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);
