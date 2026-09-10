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
  analysis: 'text-cyan-600 bg-cyan-50',
  priority: 'text-amber-600 bg-amber-50',
  routing: 'text-blue-600 bg-blue-50',
  action: 'text-violet-600 bg-violet-50',
  followup: 'text-rose-600 bg-rose-50',
  summary: 'text-emerald-600 bg-emerald-50',
};

interface AgentActivityProps {
  steps: AgentStep[];
  complaintDescription?: string;
}

export function AgentActivity({ steps, complaintDescription }: AgentActivityProps) {
  const completed = steps.filter((s) => s.status === 'Completed').length;
  const total = steps.length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Agent Activity</h2>
            <p className="text-xs text-slate-400">{completed} of {total} agents completed</p>
          </div>
        </div>
        {completed === total && total > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            All Done
          </span>
        )}
      </div>

      {complaintDescription && (
        <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Processing</p>
          <p className="mt-0.5 truncate text-sm text-slate-600">"{complaintDescription}"</p>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {steps.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No agent activity yet.</p>
        ) : (
          <div className="space-y-0">
            {steps.map((step, i) => {
              const Icon = AGENT_ICONS[step.agent_name] || ScanText;
              const colorClass = AGENT_COLORS[step.agent_name] || 'text-slate-600 bg-slate-50';
              const isLast = i === steps.length - 1;

              return (
                <div key={step.id} className="flex gap-4">
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', colorClass)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-slate-200" />}
                  </div>

                  {/* Content */}
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
