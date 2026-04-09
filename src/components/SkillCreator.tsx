import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Download, Play, Zap, FileCode, HelpCircle } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import ReactMarkdown from 'react-markdown';

interface SkillCreatorProps {
  onTransform: (doc: string, skill: string) => Promise<{ standardized: string; questions: string[] }>;
  onExecute: (doc: string, skill: string) => Promise<string>;
  t: any;
}

export const SkillCreator: React.FC<SkillCreatorProps> = ({ onTransform, onExecute, t }) => {
  const [doc, setDoc] = useState('');
  const [rawSkill, setRawSkill] = useState('');
  const [standardizedSkill, setStandardizedSkill] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransform = async () => {
    setIsProcessing(true);
    const result = await onTransform(doc, rawSkill);
    setStandardizedSkill(result.standardized);
    setQuestions(result.questions);
    setIsProcessing(false);
  };

  const handleExecute = async () => {
    setIsProcessing(true);
    const result = await onExecute(doc, standardizedSkill);
    setExecutionResult(result);
    setIsProcessing(false);
  };

  const downloadSkill = () => {
    const blob = new Blob([standardizedSkill], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'standardized_skill.md';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              {t.skillCreator}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-50">Technical Document</label>
              <Textarea 
                className="h-32 font-mono text-xs"
                placeholder="Paste the technical document here (e.g., User Manual)..."
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-50">Raw Skill (skill.md)</label>
              <Textarea 
                className="h-32 font-mono text-xs"
                placeholder="Paste your rough skill.md here..."
                value={rawSkill}
                onChange={(e) => setRawSkill(e.target.value)}
              />
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleTransform}
              disabled={!doc || !rawSkill || isProcessing}
            >
              {isProcessing ? "..." : t.standardizeSkill}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-2 border-dashed border-blue-500/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              {t.standardizeSkill}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={downloadSkill} disabled={!standardizedSkill}>
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-64 border rounded p-4 bg-muted/30">
              <div className="prose prose-xs dark:prose-invert">
                <ReactMarkdown>{standardizedSkill || "Standardized skill will appear here..."}</ReactMarkdown>
              </div>
            </ScrollArea>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleExecute}
              disabled={!standardizedSkill || isProcessing}
            >
              <Play className="w-4 h-4 mr-2" />
              {isProcessing ? "..." : t.executeSkill}
            </Button>
          </CardContent>
        </Card>
      </div>

      {executionResult && (
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-green-500/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Execution Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{executionResult}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {questions.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-500" />
              {t.followUpQuestions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {questions.map((q, i) => (
                <div key={i} className="flex gap-2 text-sm p-2 bg-muted/50 rounded border">
                  <span className="font-bold text-purple-500">{i + 1}.</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
