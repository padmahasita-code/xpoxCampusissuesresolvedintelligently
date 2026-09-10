import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ScanText, AlertTriangle, Building2, ClipboardList, BellRing, FileText, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AgentStep } from '@/lib/supabase';

interface AnalysisPageProps {
  onComplete: () => void;
  agentSteps: AgentStep[];
  isRunning: boolean;
  complaintDescription: string;
}

const AGENT_ICONS: Record<string, typeof ScanText> = {
  analysis: ScanText,
  priority: AlertTriangle,
  routing: Building2,
  action: ClipboardList,
  followup: BellRing,
  summary: FileText,
};

const AGENT_COLORS: Record<string, string> = {
  analysis: 'text-cyan-600 bg-gradient-to-br from-cyan-100 to-blue-100 border-cyan-200',
  priority: 'text-amber-600 bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-200',
  routing: 'text-blue-600 bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200',
  action: 'text-violet-600 bg-gradient-to-br from-violet-100 to-purple-100 border-violet-200',
  followup: 'text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 border-rose-200',
  summary: 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-200',
};

const AGENT_DONE_BG: Record<string, string> = {
  analysis: 'from-cyan-50/60 to-blue-50/40',
  priority: 'from-amber-50/60 to-yellow-50/40',
  routing: 'from-blue-50/60 to-indigo-50/40',
  action: 'from-violet-50/60 to-purple-50/40',
  followup: 'from-rose-50/60 to-pink-50/40',
  summary: 'from-emerald-50/60 to-green-50/40',
};

const DEFAULT_STEPS = [
  { agent_name: 'analysis', agent_label: 'Complaint Analysis Agent' },
  { agent_name: 'priority', agent_label: 'Priority Agent' },
  { agent_name: 'routing', agent_label: 'Department Routing Agent' },
  { agent_name: 'action', agent_label: 'Action Planning Agent' },
  { agent_name: 'followup', agent_label: 'Follow-up Agent' },
  { agent_name: 'summary', agent_label: 'Summary Agent' },
];

export function AnalysisPage({ onComplete, agentSteps, isRunning, complaintDescription }: AnalysisPageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= DEFAULT_STEPS.length) {
      const timer = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), 700 + currentStep * 200);
    return () => clearTimeout(timer);
  }, [isRunning, currentStep, onComplete]);

  const steps = agentSteps.length > 0
    ? agentSteps
    : DEFAULT_STEPS.map((s, i) => ({
        id: `temp-${i}`,
        complaint_id: '',
        agent_name: s.agent_name,
        agent_label: s.agent_label,
        status: i < currentStep ? 'Completed' : i === currentStep && isRunning ? 'Processing' : 'Waiting',
        output: null,
        timestamp: new Date().toISOString(),
        step_order: i,
      })) as AgentStep[];

  const completedCount = steps.filter((s) => s.status === 'Completed').length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className={cn(
          "absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl transition-colors duration-1000",
          isRunning ? "bg-gradient-to-br from-cyan-300/20 to-blue-400/15" : "bg-gradient-to-br from-emerald-300/20 to-green-400/15"
        )} />
      </div>

      <div className="mb-8 text-center animate-fade-in">
        <div className={cn(
          "relative mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-500",
          isRunning
            ? "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 shadow-blue-500/30"
            : "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30"
        )}>
          {isRunning ? (
            <>
              <div className="absolute inset-0 animate-ping rounded-2xl bg-cyan-400/40" />
              <Loader2 className="relative h-8 w-8 animate-spin" />
            </>
          ) : (
            <CheckCircle2 className="h-8 w-8" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {isRunning ? 'AI Agents Processing' : 'Analysis Complete'}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          {isRunning
            ? 'Your complaint is being analyzed by six specialized AI agents working in sequence.'
            : 'All agents have finished processing. Preparing your complaint report...'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">Agent Progress</span>
          <span className="font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200/70 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 transition-all duration-500 ease-out shadow-lg shadow-blue-500/30"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Complaint preview */}
      {complaintDescription && (
        <div className="mb-8 overflow-hidden rounded-xl border border-cyan-200/60 bg-gradient-to-br from-cyan-50 to-blue-50 px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">Complaint</p>
          <p className="mt-1 text-sm font-medium text-slate-700">"{complaintDescription}"</p>
        </div>
      )}

      {/* Agent pipeline */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = AGENT_ICONS[step.agent_name] || ScanText;
          const colorClass = AGENT_COLORS[step.agent_name] || 'text-slate-600 bg-slate-100 border-slate-200';
          const doneBg = AGENT_DONE_BG[step.agent_name] || 'from-slate-50/60 to-slate-50/40';
          const isCompleted = step.status === 'Completed';
          const isProcessing = step.status === 'Processing';
          const isWaiting = step.status === 'Waiting';

          return (
            <div
              key={step.id || i}
              className={cn(
                'flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300 animate-slide-up',
                isCompleted && cn('border-slate-200/80 bg-gradient-to-br shadow-sm', doneBg),
                isProcessing && 'border-blue-300/80 bg-gradient-to-br from-blue-50/80 to-cyan-50/60 shadow-lg shadow-blue-500/10',
                isWaiting && 'border-slate-200/60 bg-slate-50/40',
              )}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Icon / status circle */}
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm', colorClass)}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isProcessing ? (
                  <>
                    <div className="absolute h-10 w-10 animate-ping rounded-xl bg-blue-400/30" />
                    <Loader2 className="relative h-5 w-5 animate-spin" />
                  </>
                ) : (
                  <Icon className="h-5 w-5 opacity-40" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={cn('text-sm font-bold', isWaiting ? 'text-slate-400' : 'text-slate-900')}>
                    {step.agent_label}
                  </h3>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                      isCompleted && 'bg-emerald-100 text-emerald-700',
                      isProcessing && 'bg-blue-100 text-blue-700',
                      isWaiting && 'bg-slate-100 text-slate-400',
                    )}
                  >
                    {isCompleted ? 'Completed' : isProcessing ? 'Processing...' : 'Waiting'}
                  </span>
                </div>
                {isCompleted && step.output && (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{step.output}</p>
                )}
                {isProcessing && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '150ms' }} />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '300ms' }} />
                    <span className="ml-1 text-xs text-slate-400">Analyzing complaint data...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isRunning && completedCount === steps.length && (
        <div className="mt-8 text-center animate-fade-in">
          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:brightness-110"
          >
            View Results
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
}
