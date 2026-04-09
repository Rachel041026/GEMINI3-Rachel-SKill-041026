import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PainterStyle } from '../types';
import { PAINTER_STYLES } from '../lib/constants';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PainterStyleEngineProps {
  currentStyle: PainterStyle;
  onStyleChange: (style: PainterStyle) => void;
  t: any;
}

export const PainterStyleEngine: React.FC<PainterStyleEngineProps> = ({ currentStyle, onStyleChange, t }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayStyles, setDisplayStyles] = useState<PainterStyle[]>(['Default', 'Van Gogh', 'Picasso']);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomStyles = Array.from({ length: 3 }, () => PAINTER_STYLES[Math.floor(Math.random() * PAINTER_STYLES.length)]);
      setDisplayStyles(randomStyles as PainterStyle[]);
      count++;
      
      if (count >= maxCount) {
        clearInterval(interval);
        const finalStyle = PAINTER_STYLES[Math.floor(Math.random() * PAINTER_STYLES.length)];
        setDisplayStyles([finalStyle, finalStyle, finalStyle]);
        onStyleChange(finalStyle);
        setIsSpinning(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-xl bg-card/50 backdrop-blur-sm">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        {t.spinForStyle}
      </h3>
      
      <div className="flex gap-2 bg-black/20 p-4 rounded-lg border-4 border-yellow-600/50 shadow-inner overflow-hidden h-24 items-center">
        {displayStyles.map((style, i) => (
          <motion.div
            key={`${style}-${i}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-24 h-16 flex items-center justify-center bg-white/10 rounded border border-white/20 text-xs font-bold text-center px-1"
          >
            {style}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={spin} 
          disabled={isSpinning}
          className="bg-yellow-600 hover:bg-yellow-700 text-white border-none shadow-lg"
        >
          {isSpinning ? "..." : t.spinForStyle}
        </Button>
        
        <select 
          value={currentStyle} 
          onChange={(e) => onStyleChange(e.target.value as PainterStyle)}
          className="bg-background border rounded px-2 text-sm"
        >
          {PAINTER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      
      <p className="text-xs text-muted-foreground italic">
        {t.currentAesthetic}: <span className="font-bold text-primary">{currentStyle}</span>
      </p>
    </div>
  );
};
