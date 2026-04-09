import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ModelConfig, APIKeys } from '../types';
import { Key, Settings2, Cpu } from 'lucide-react';

interface ModelLabProps {
  config: ModelConfig;
  onConfigChange: (config: ModelConfig) => void;
  apiKeys: APIKeys;
  onKeysChange: (keys: APIKeys) => void;
  t: any;
}

export const ModelLab: React.FC<ModelLabProps> = ({ config, onConfigChange, apiKeys, onKeysChange, t }) => {
  const providers = [
    { id: 'google', name: 'Google (Gemini)', models: ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-3-flash-lite-preview'] },
    { id: 'openai', name: 'OpenAI (GPT)', models: ['gpt-4o-mini', 'gpt-4.1-mini'] },
    { id: 'anthropic', name: 'Anthropic (Claude)', models: ['claude-3.5-sonnet', 'claude-3-opus'] },
    { id: 'grok', name: 'xAI (Grok)', models: ['grok-4-fast-reasoning', 'grok-3-mini'] },
  ];

  const currentProvider = providers.find(p => p.id === config.provider);

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            {t.modelSelection}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold opacity-50">Provider</label>
              <Select 
                value={config.provider} 
                onValueChange={(v) => onConfigChange({ ...config, provider: v as any, model: providers.find(p => p.id === v)?.models[0] || '' })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold opacity-50">Model</label>
              <Select 
                value={config.model} 
                onValueChange={(v) => onConfigChange({ ...config, model: v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentProvider?.models.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-purple-500" />
            {t.basePrompt}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            className="text-xs font-mono h-32"
            value={config.prompt}
            onChange={(e) => onConfigChange({ ...config, prompt: e.target.value })}
            placeholder="Modify the base system prompt for all agents..."
          />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Key className="w-4 h-4 text-yellow-500" />
            {t.apiKeyMgmt}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <KeyInput 
            label="Gemini API Key" 
            value={apiKeys.gemini || ''} 
            onChange={(v) => onKeysChange({ ...apiKeys, gemini: v })} 
            isEnv={!!process.env.GEMINI_API_KEY}
          />
          <KeyInput 
            label="OpenAI API Key" 
            value={apiKeys.openai || ''} 
            onChange={(v) => onKeysChange({ ...apiKeys, openai: v })} 
          />
          <KeyInput 
            label="Anthropic API Key" 
            value={apiKeys.anthropic || ''} 
            onChange={(v) => onKeysChange({ ...apiKeys, anthropic: v })} 
          />
          <KeyInput 
            label="Grok API Key" 
            value={apiKeys.grok || ''} 
            onChange={(v) => onKeysChange({ ...apiKeys, grok: v })} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

const KeyInput = ({ label, value, onChange, isEnv }: { label: string, value: string, onChange: (v: string) => void, isEnv?: boolean }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <label className="text-[10px] uppercase font-bold opacity-50">{label}</label>
      {isEnv && <Badge variant="outline" className="text-[8px] h-4 bg-green-500/10 text-green-500 border-green-500/20">Loaded from Env</Badge>}
    </div>
    {!isEnv && (
      <Input 
        type="password" 
        className="h-8 text-xs font-mono" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label}...`}
      />
    )}
  </div>
);
