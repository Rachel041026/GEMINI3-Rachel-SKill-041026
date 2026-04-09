import React from 'react';
import { Button } from './ui/button';
import { Language } from '../types';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onLanguageChange }) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => onLanguageChange(language === 'en' ? 'zh' : 'en')}
      className="flex items-center gap-2 font-bold"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'EN' : '繁中'}
    </Button>
  );
};
