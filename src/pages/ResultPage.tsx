import { useState } from 'react';
import {
  ArrowLeft,
  ScanText,
  AlertTriangle,
  Building2,
  ClipboardList,
  BellRing,
  FileText,
  Clock,
  CheckCircle2,
  PlayCircle,
  Hash,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';
import type { Complaint, ComplaintStatus } from '@/lib/supabase';
import { PriorityBadge, StatusBadge, CategoryBadge } from '@/components/Badges';

interface ResultPageProps {
  complaint: Complaint;
  onBack: () => void;
  onUpdateStatus: (id: string, status: ComplaintStatus) => Promise<void>;
}

const STATUS_OPTIONS: ComplaintStatus[] = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

const STATUS_BTN_STYLES: Record<string, { gradient: string; icon: typeof CheckCircle2 }> = {
  'Submitted': { gradient: 'from-sky-500 to-cyan-600', icon: Hash },
  'Assigned': { gradient: 'from-blue-500 to-indigo-600', icon: Hash },
  'In Progress': { gradient: 'from-violet-500 to-purple-600', icon: PlayCircle },
  'Resolved': { gradient: 'from-emerald-500 to-green-600', icon: CheckCircle2 },
};

export function ResultPage({ complaint, onBack, onUpdateStatus }: ResultPageProps) {
  const [updating, setUpdating] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const handleStatus = async (status: ComplaintStatus) => {
    setUpdating(true);
    try {
      await onUpdateStatus(complaint.id, status);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-500">
                  #{complaint.id.slice(0, 8).toUpperCase()}
                </span>
                <StatusBadge status={complaint.status} size="md" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">{complaint.issue_summary || complaint.description}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1"><User className="h-4 w-4 text-slate-400" />{complaint.student_name}</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1"><MapPin className="h-4 w-4 text-slate-400" />{complaint.location}</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1"><Calendar className="h-4 w-4 text-slate-400" />{new Date(complaint.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <PriorityBadge priority={complaint.priority} size="md" />
              <CategoryBadge category={complaint.category} />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Results Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Complaint Analysis */}
        <AgentCard icon={ScanText} title="Complaint Analysis" gradient="from-cyan-500 to-blue-600" border="border-cyan-200/60">
          <Row label="Issue Summary" value={complaint.issue_summary} />
          <Row label="Issue Type" value={complaint.issue_type} />
          {complaint.keywords && complaint.keywords.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Keywords</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {complaint.keywords.map((kw) => (
                  <span key={kw} className="rounded-md bg-gradient-to-br from-cyan-50 to-blue-50 px-2 py-0.5 text-xs font-medium text-cyan-700 ring-1 ring-cyan-200/40">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </AgentCard>

        {/* Priority */}
        <AgentCard icon={AlertTriangle} title="Priority Assessment" gradient="from-amber-500 to-orange-600" border="border-amber-200/60">
          <div className="mb-3">
            <PriorityBadge priority={complaint.priority} size="md" />
          </div>
          <Row label="Reasoning" value={complaint.priority_reason} />
        </AgentCard>

        {/* Department Routing */}
        <AgentCard icon={Building2} title="Department Routing" gradient="from-blue-500 to-indigo-600" border="border-blue-200/60">
          <Row label="Department" value={complaint.department} />
          <Row label="Reasoning" value={complaint.department_reason} />
        </AgentCard>

        {/* Action Planning */}
        <AgentCard icon={ClipboardList} title="Action Plan" gradient="from-violet-500 to-purple-600" border="border-violet-200/60">
          <Row label="Recommended Action" value={complaint.recommended_action} />
          <Row label="Next Step" value={complaint.next_step} />
          <Row label="Expected Response" value={complaint.expected_response} icon={Clock} />
        </AgentCard>

        {/* Follow-up */}
        <AgentCard icon={BellRing} title="Follow-up" gradient="from-rose-500 to-pink-600" border="border-rose-200/60">
          <Row label="Message" value={complaint.follow_up_message} />
        </AgentCard>

        {/* Summary */}
        <AgentCard icon={FileText} title="Summary Report" gradient="from-emerald-500 to-green-600" border="border-emerald-200/60">
          <pre className="whitespace-pre-wrap rounded-lg bg-gradient-to-br from-emerald-50/50 to-green-50/30 p-3 text-xs leading-relaxed text-slate-600">
            {complaint.final_report}
          </pre>
        </AgentCard>
      </div>

      {/* Action buttons */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600" />
        <div className="p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">Update Status</h2>
          <div className="flex flex-wrap gap-3">
            {STATUS_OPTIONS.map((status) => {
              const isCurrent = complaint.status === status;
              const style = STATUS_BTN_STYLES[status];
              const Icon = style?.icon || Hash;
              return (
                <button
                  key={status}
                  onClick={() => handleStatus(status)}
                  disabled={isCurrent || updating}
                  className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                    isCurrent
                      ? 'cursor-default border-transparent bg-gradient-to-r text-white shadow-lg ' + (style?.gradient || '')
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm disabled:opacity-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {isCurrent ? 'Current' : `Mark ${status}`}
                </button>
              );
            })}
            <button
              onClick={() => setShowFollowUp((s) => !s)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-all hover:shadow-md"
            >
              <BellRing className="h-4 w-4" />
              {showFollowUp ? 'Hide' : 'Create'} Follow-up
            </button>
          </div>

          {showFollowUp && (
            <div className="mt-4 overflow-hidden rounded-xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-pink-50 px-4 py-3 shadow-sm animate-fade-in">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Follow-up Message</p>
              <p className="mt-1 text-sm text-slate-700">{complaint.follow_up_message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────
function AgentCard({
  icon: Icon,
  title,
  gradient,
  border,
  children,
}: {
  icon: typeof ScanText;
  title: string;
  gradient: string;
  border: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border ${border} bg-white shadow-sm transition-all hover:shadow-lg`}>
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string | null | undefined; icon?: typeof Clock }) {
  return (
    <div className="mb-2.5 last:mb-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 flex items-start gap-1.5 text-sm text-slate-700">
        {Icon && <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />}
        {value || '—'}
      </p>
    </div>
  );
}
