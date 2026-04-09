import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';

interface LiveLogProps {
  logs: LogEntry[];
  t: any;
}

export const LiveLog: React.FC<LiveLogProps> = ({ logs, t }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full border rounded-xl bg-black text-green-400 font-mono text-xs overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <span className="text-[10px] uppercase tracking-widest opacity-70">{t.liveReasoning}</span>
        </div>
        <div className="text-[10px] opacity-50">v3.0.0-PRO</div>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <span className="opacity-30">[{log.timestamp}]</span>
                <span className="text-blue-400 font-bold">[{log.agentName}]</span>
                <span className={
                  log.type === 'error' ? 'text-red-500' : 
                  log.type === 'warning' ? 'text-yellow-500' : 
                  log.type === 'success' ? 'text-green-300' : 'text-green-400'
                }>
                  {log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      <div className="px-4 py-1 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
        <div className="w-1.5 h-3 bg-green-500 animate-pulse"></div>
        <span className="text-[10px] opacity-50 italic">Listening for agent telemetry...</span>
      </div>
    </div>
  );
};
