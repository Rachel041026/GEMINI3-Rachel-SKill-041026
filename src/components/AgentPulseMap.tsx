import React from 'react';
import { Agent } from '../types';
import { motion } from 'motion/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '../lib/utils';

interface AgentPulseMapProps {
  agents: Agent[];
  t: any;
}

export const AgentPulseMap: React.FC<AgentPulseMapProps> = ({ agents, t }) => {
  return (
    <div className="p-4 border rounded-xl bg-card/50 backdrop-blur-sm">
      <h3 className="text-sm font-bold mb-4 uppercase tracking-widest opacity-70">{t.agentPulseMap}</h3>
      <div className="grid grid-cols-7 gap-2">
        <TooltipProvider>
          {agents.map((agent) => (
            <Tooltip key={agent.id}>
              <TooltipTrigger>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={cn(
                    "w-8 h-8 rounded-sm border flex items-center justify-center text-[10px] font-bold cursor-help transition-colors",
                    agent.status === 'idle' && "bg-slate-800 border-slate-700 text-slate-500",
                    agent.status === 'active' && "bg-blue-500 border-blue-400 text-white animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]",
                    agent.status === 'error' && "bg-red-500 border-red-400 text-white",
                    agent.status === 'complete' && "bg-green-500 border-green-400 text-white"
                  )}
                >
                  {agent.id}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-bold">{agent.name}</p>
                  <p className="opacity-70">{agent.role}</p>
                  <p className="mt-1 italic">{agent.description}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase">Status: {agent.status}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <div className="mt-4 flex justify-between text-[10px] uppercase opacity-50 font-mono">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-800 rounded-full"></div> Idle</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Active</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Done</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Error</div>
      </div>
    </div>
  );
};
