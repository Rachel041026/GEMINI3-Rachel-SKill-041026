export type Theme = 'light' | 'dark';
export type Language = 'en' | 'zh';

export interface Agent {
  id: number;
  name: string;
  role: string;
  status: 'idle' | 'active' | 'error' | 'complete';
  description: string;
  group: 'Intake' | 'Technical' | 'Regulatory' | 'WOW';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agentName: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export type PainterStyle = 
  | 'Default' | 'Van Gogh' | 'Picasso' | 'Monet' | 'Dali' 
  | 'Basquiat' | 'Hokusai' | 'Banksy' | 'Warhol' | 'Kahlo' 
  | 'Rembrandt' | 'Vermeer' | 'Klimt' | 'Mondrian' | 'Pollock' 
  | 'Matisse' | 'Munch' | 'Hopper' | 'O\'Keeffe' | 'Lichtenstein' | 'Kusama';

export interface ModelConfig {
  provider: 'google' | 'openai' | 'anthropic' | 'grok';
  model: string;
  prompt: string;
}

export interface APIKeys {
  gemini?: string;
  openai?: string;
  anthropic?: string;
  grok?: string;
}

export interface SubmissionData {
  content: string;
  template: string;
  language: Language;
}

export interface ReviewResults {
  webSummary: string;
  fdaSummary: string;
  dataset: any[];
  report: string;
  skillMd: string;
  followUpQuestions: string[];
  formQuestions: string[];
}
