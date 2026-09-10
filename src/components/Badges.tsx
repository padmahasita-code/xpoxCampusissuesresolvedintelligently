import { cn } from '@/lib/cn';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type Status = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
type AgentStatus = 'Waiting' | 'Processing' | 'Completed';

const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: 'bg-slate-100 text-slate-600 border-slate-300/50',
  MEDIUM: 'bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700 border-amber-300/60',
  HIGH: 'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 border-orange-300/60',
  CRITICAL: 'bg-gradient-to-br from-red-100 to-rose-100 text-red-700 border-red-300/60',
};

const PRIORITY_DOT: Record<Priority, string> = {
  LOW: 'bg-slate-400',
  MEDIUM: 'bg-amber-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

const STATUS_STYLES: Record<Status, string> = {
  Submitted: 'bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-700 border-sky-300/60',
  Assigned: 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 border-blue-300/60',
  'In Progress': 'bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700 border-violet-300/60',
  Resolved: 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-700 border-emerald-300/60',
};

const STATUS_DOT: Record<Status, string> = {
  Submitted: 'bg-sky-500',
  Assigned: 'bg-blue-500',
  'In Progress': 'bg-violet-500',
  Resolved: 'bg-emerald-500',
};

const AGENT_STATUS_STYLES: Record<AgentStatus, string> = {
  Waiting: 'bg-slate-100 text-slate-500 border-slate-300/50',
  Processing: 'bg-gradient-to-br from-sky-100 to-blue-100 text-blue-600 border-blue-300/60',
  Completed: 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600 border-emerald-300/60',
};

const CATEGORY_STYLES: Record<string, string> = {
  'IT / Wi-Fi': 'border-sky-200/60 bg-gradient-to-br from-sky-50 to-cyan-50 text-sky-700',
  'Electrical': 'border-amber-200/60 bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-700',
  'Maintenance': 'border-slate-200/60 bg-gradient-to-br from-slate-50 to-gray-50 text-slate-600',
  'Water / Sanitation': 'border-blue-200/60 bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700',
  'Laboratory': 'border-violet-200/60 bg-gradient-to-br from-violet-50 to-purple-50 text-violet-700',
  'Cleanliness': 'border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700',
};

export function PriorityBadge({ priority, size = 'sm' }: { priority: Priority; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold shadow-sm',
        PRIORITY_STYLES[priority],
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_DOT[priority], priority === 'CRITICAL' && 'animate-pulse')} />
      {priority}
    </span>
  );
}

export function StatusBadge({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold shadow-sm',
        STATUS_STYLES[status],
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[status], status === 'In Progress' && 'animate-pulse')} />
      {status}
    </span>
  );
}

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm',
        AGENT_STATUS_STYLES[status],
      )}
    >
      {status === 'Processing' && (
        <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
      )}
      {status === 'Completed' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      {status === 'Waiting' && <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
      {status}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_STYLES[category] || 'border-cyan-200/60 bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-700';
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm', style)}>
      {category}
    </span>
  );
}
