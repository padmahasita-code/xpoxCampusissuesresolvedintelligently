import { cn } from '@/lib/cn';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type Status = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved';
type AgentStatus = 'Waiting' | 'Processing' | 'Completed';

const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
  CRITICAL: 'bg-red-50 text-red-700 border-red-200',
};

const PRIORITY_DOT: Record<Priority, string> = {
  LOW: 'bg-slate-400',
  MEDIUM: 'bg-amber-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

const STATUS_STYLES: Record<Status, string> = {
  Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  Assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'In Progress': 'bg-violet-50 text-violet-700 border-violet-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_DOT: Record<Status, string> = {
  Submitted: 'bg-blue-500',
  Assigned: 'bg-indigo-500',
  'In Progress': 'bg-violet-500',
  Resolved: 'bg-emerald-500',
};

const AGENT_STATUS_STYLES: Record<AgentStatus, string> = {
  Waiting: 'bg-slate-100 text-slate-500 border-slate-200',
  Processing: 'bg-blue-50 text-blue-600 border-blue-200',
  Completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export function PriorityBadge({ priority, size = 'sm' }: { priority: Priority; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        PRIORITY_STYLES[priority],
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_DOT[priority])} />
      {priority}
    </span>
  );
}

export function StatusBadge({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        STATUS_STYLES[status],
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[status])} />
      {status}
    </span>
  );
}

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        AGENT_STATUS_STYLES[status],
      )}
    >
      {status === 'Processing' && (
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
      )}
      {status === 'Completed' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      {status === 'Waiting' && <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
      {status}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-0.5 text-xs font-semibold text-cyan-700">
      {category}
    </span>
  );
}
