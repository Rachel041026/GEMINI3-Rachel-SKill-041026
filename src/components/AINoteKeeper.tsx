import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ReactMarkdown from 'react-markdown';
import { Wand2, FileText, Layout, Key, AlertTriangle, Link, MessageSquare, ShieldAlert } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface AINoteKeeperProps {
  onMagic: (magicType: string, content: string) => Promise<string>;
  t: any;
}

export const AINoteKeeper: React.FC<AINoteKeeperProps> = ({ onMagic, t }) => {
  const [note, setNote] = useState('');
  const [transformedNote, setTransformedNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const transformToCoral = async () => {
    setIsProcessing(true);
    // Simulate transformation logic
    // In a real app, this calls Gemini
    const result = await onMagic('coralize', note);
    setTransformedNote(result);
    setIsProcessing(false);
  };

  const applyMagic = async (magicType: string) => {
    setIsProcessing(true);
    const result = await onMagic(magicType, transformedNote || note);
    setTransformedNote(result);
    setIsProcessing(false);
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-coral-500" />
          {t.noteKeeper}
        </CardTitle>
        <Button 
          onClick={transformToCoral} 
          disabled={!note || isProcessing}
          className="bg-[#FF7F50] hover:bg-[#FF6347] text-white"
        >
          {isProcessing ? "..." : t.coralTransform}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[500px]">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase opacity-50">Raw Input (Text/Markdown)</label>
            <Textarea 
              className="flex-1 font-mono text-sm resize-none"
              placeholder="Paste your regulatory notes here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase opacity-50">AI Enhanced View</label>
            <Tabs defaultValue="preview" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Markdown Preview</TabsTrigger>
                <TabsTrigger value="raw">Raw Markdown</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="flex-1 border rounded-md p-4 bg-muted/30 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        span: ({ node, ...props }) => {
                          if (props.className === 'coral-keyword') {
                            return <span style={{ color: '#FF7F50', fontWeight: 'bold' }}>{props.children}</span>;
                          }
                          return <span {...props} />;
                        }
                      }}
                    >
                      {transformedNote || "Transform your notes to see the AI-enhanced view with Coral keywords."}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="raw" className="flex-1">
                <Textarea 
                  className="h-full font-mono text-sm resize-none"
                  value={transformedNote}
                  onChange={(e) => setTransformedNote(e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-500" />
            {t.aiMagics}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <MagicButton icon={<Layout className="w-4 h-4" />} label="Summarize" onClick={() => applyMagic('summarize')} disabled={isProcessing} />
            <MagicButton icon={<AlertTriangle className="w-4 h-4" />} label="Gap Finder" onClick={() => applyMagic('gap-finder')} disabled={isProcessing} />
            <MagicButton icon={<Link className="w-4 h-4" />} label="Citation" onClick={() => applyMagic('citation')} disabled={isProcessing} />
            <MagicButton icon={<Key className="w-4 h-4" />} label="Keywords" onClick={() => applyMagic('keywords')} disabled={isProcessing} />
            <MagicButton icon={<MessageSquare className="w-4 h-4" />} label="Tone Shift" onClick={() => applyMagic('tone-shift')} disabled={isProcessing} />
            <MagicButton icon={<ShieldAlert className="w-4 h-4" />} label="Risk Map" onClick={() => applyMagic('risk-map')} disabled={isProcessing} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MagicButton = ({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean }) => (
  <Button 
    variant="outline" 
    size="sm" 
    className="flex flex-col h-auto py-3 gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
    onClick={onClick}
    disabled={disabled}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase">{label}</span>
  </Button>
);
