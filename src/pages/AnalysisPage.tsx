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
  analysis: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  priority: 'text-amber-600 bg-amber-50 border-amber-200',
  routing: 'text-blue-600 bg-blue-50 border-blue-200',
  action: 'text-violet-600 bg-violet-50 border-violet-200',
  followup: 'text-rose-600 bg-rose-50 border-rose-200',
  summary: 'text-emerald-600 bg-emerald-50 border-emerald-200',
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

  // Simulate progressive agent activation while running
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
          {isRunning ? <Loader2 className="h-8 w-8 animate-spin" /> : <CheckCircle2 className="h-8 w-8" />}
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
          <span className="font-bold text-cyan-600">{progress}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Complaint preview */}
      {complaintDescription && (
        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Complaint</p>
          <p className="mt-1 text-sm text-slate-700">"{complaintDescription}"</p>
        </div>
      )}

      {/* Agent pipeline */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = AGENT_ICONS[step.agent_name] || ScanText;
          const colorClass = AGENT_COLORS[step.agent_name] || 'text-slate-600 bg-slate-50';
          const isCompleted = step.status === 'Completed';
          const isProcessing = step.status === 'Processing';
          const isWaiting = step.status === 'Waiting';

          return (
            <div
              key={step.id || i}
              className={cn(
                'flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300',
                isCompleted && 'border-slate-200 bg-white shadow-sm',
                isProcessing && 'border-cyan-200 bg-cyan-50/50 shadow-md shadow-cyan-500/10',
                isWaiting && 'border-slate-200 bg-slate-50/50',
              )}
            >
              {/* Icon / status circle */}
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', colorClass)}>
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className="h-5 w-5 opacity-50" />
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
                      'shrink-0 text-xs font-semibold',
                      isCompleted && 'text-emerald-600',
                      isProcessing && 'text-blue-600',
                      isWaiting && 'text-slate-400',
                    )}
                  >
                    {isCompleted ? 'Completed' : isProcessing ? 'Processing...' : 'Waiting'}
                  </span>
                </div>
                {isCompleted && step.output && (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{step.output}</p>
                )}
                {isProcessing && (
                  <p className="mt-1.5 text-xs text-slate-400">Analyzing complaint data...</p>
                )}
              </div>

              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="hidden items-center self-stretch sm:flex">
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isRunning && completedCount === steps.length && (
        <div className="mt-8 text-center">
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:brightness-105"
          >
            View Results
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
