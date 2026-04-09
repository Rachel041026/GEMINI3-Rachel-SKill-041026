import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  FileJson, Download, Save, RefreshCw, 
  CheckCircle2, HelpCircle, Info, Layout
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SubmissionFormProps {
  dataset: any[];
  questions: string[];
  onUpdate: (newDataset: any[]) => void;
  t: any;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ dataset, questions, onUpdate, t }) => {
  const [localData, setLocalData] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setLocalData(dataset);
  }, [dataset]);

  const handleChange = (index: number, value: string) => {
    const newData = [...localData];
    newData[index].value = value;
    setLocalData(newData);
  };

  const handleSave = () => {
    onUpdate(localData);
  };

  const categories = ['all', ...new Set(localData.map(item => item.category))];

  const filteredData = activeCategory === 'all' 
    ? localData 
    : localData.filter(item => item.category === activeCategory);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(localData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '510k_submission_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (localData.length === 0) {
    return (
      <Card className="bg-card/50 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center p-12 text-center">
        <FileJson className="w-12 h-12 opacity-20 mb-4" />
        <CardTitle className="opacity-50">No Dataset Available</CardTitle>
        <CardDescription>Generate a 510(k) review first to populate this form.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-purple-500" />
              {t.submissionForm}
            </CardTitle>
            <CardDescription>Edit and verify extracted 510(k) entities</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadJson}>
              <Download className="w-4 h-4 mr-2" /> {t.download}
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> {t.edit}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="text-[10px] uppercase font-bold tracking-widest"
              >
                {cat}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((item, idx) => {
                const originalIdx = localData.findIndex(d => d.entity === item.entity);
                return (
                  <motion.div 
                    key={item.entity}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="space-y-2 p-4 bg-muted/30 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black uppercase tracking-tighter text-primary">
                        {item.entity}
                      </Label>
                      <Badge variant="secondary" className="text-[8px] uppercase">{item.category}</Badge>
                    </div>
                    <Input 
                      value={item.value} 
                      onChange={(e) => handleChange(originalIdx, e.target.value)}
                      className="bg-background/50 border-primary/10 focus:border-primary"
                    />
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="pt-6 border-t border-primary/10">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              {t.followUpQuestions}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(questions.length > 0 ? questions : Array.from({ length: 20 }).map((_, i) => `How does the ${localData[i % localData.length]?.entity || 'device'} specification impact the overall safety profile?`)).map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                  <span className="text-[10px] font-mono opacity-50">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-xs opacity-80">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
