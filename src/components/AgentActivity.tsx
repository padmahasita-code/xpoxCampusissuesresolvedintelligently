import { Activity, ScanText, AlertTriangle, Building2, ClipboardList, BellRing, FileText, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AgentStep } from '@/lib/supabase';
import { AgentStatusBadge } from '@/components/Badges';

const AGENT_ICONS: Record<string, typeof ScanText> = {
  analysis: ScanText,
  priority: AlertTriangle,
  routing: Building2,
  action: ClipboardList,
  followup: BellRing,
  summary: FileText,
};

const AGENT_COLORS: Record<string, string> = {
  analysis: 'text-cyan-600 bg-gradient-to-br from-cyan-100 to-blue-100 ring-cyan-200',
  priority: 'text-amber-600 bg-gradient-to-br from-amber-100 to-yellow-100 ring-amber-200',
  routing: 'text-blue-600 bg-gradient-to-br from-blue-100 to-indigo-100 ring-blue-200',
  action: 'text-violet-600 bg-gradient-to-br from-violet-100 to-purple-100 ring-violet-200',
  followup: 'text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 ring-rose-200',
  summary: 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-green-100 ring-emerald-200',
};

const AGENT_LINE: Record<string, string> = {
  analysis: 'from-cyan-400 to-blue-400',
  priority: 'from-amber-400 to-yellow-400',
  routing: 'from-blue-400 to-indigo-400',
  action: 'from-violet-400 to-purple-400',
  followup: 'from-rose-400 to-pink-400',
  summary: 'from-emerald-400 to-green-400',
};

interface AgentActivityProps {
  steps: AgentStep[];
  complaintDescription?: string;
}

export function AgentActivity({ steps, complaintDescription }: AgentActivityProps) {
  const completed = steps.filter((s) => s.status === 'Completed').length;
  const total = steps.length;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Agent Activity</h2>
            <p className="text-xs text-slate-400">{completed} of {total} agents completed</p>
          </div>
        </div>
        {completed === total && total > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            All Done
          </span>
        )}
      </div>

      {complaintDescription && (
        <div className="mb-4 rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Processing</p>
          <p className="mt-0.5 truncate text-sm font-medium text-slate-700">"{complaintDescription}"</p>
        </div>
      )}

      <div className="relative">
        {steps.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No agent activity yet.</p>
        ) : (
          <div className="space-y-0">
            {steps.map((step, i) => {
              const Icon = AGENT_ICONS[step.agent_name] || ScanText;
              const colorClass = AGENT_COLORS[step.agent_name] || 'text-slate-600 bg-slate-100 ring-slate-200';
              const lineClass = AGENT_LINE[step.agent_name] || 'from-slate-300 to-slate-300';
              const isLast = i === steps.length - 1;

              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-white shadow-sm', colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {!isLast && (
                      <div className={cn('w-0.5 flex-1 bg-gradient-to-b', lineClass)} style={{ minHeight: '2.5rem' }} />
                    )}
                  </div>

                  <div className={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-5')}>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-900">{step.agent_label}</h3>
                      <AgentStatusBadge status={step.status} />
                    </div>
                    {step.output && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.output}</p>
                    )}
                    {step.timestamp && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Clock className="h-3 w-3" />
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
