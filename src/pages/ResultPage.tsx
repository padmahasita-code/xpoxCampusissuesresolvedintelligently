import { useState } from 'react';
import {
  ArrowLeft,
  ScanText,
  AlertTriangle,
  Building2,
  ClipboardList,
  BellRing,
  FileText,
  Tag,
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
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-400">
                #{complaint.id.slice(0, 8).toUpperCase()}
              </span>
              <StatusBadge status={complaint.status} size="md" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{complaint.issue_summary || complaint.description}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" />{complaint.student_name}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{complaint.location}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(complaint.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <PriorityBadge priority={complaint.priority} size="md" />
            <CategoryBadge category={complaint.category} />
          </div>
        </div>
      </div>

      {/* Agent Results Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Complaint Analysis */}
        <AgentCard icon={ScanText} title="Complaint Analysis" color="text-cyan-600 bg-cyan-50">
          <Row label="Issue Summary" value={complaint.issue_summary} />
          <Row label="Issue Type" value={complaint.issue_type} />
          {complaint.keywords && complaint.keywords.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Keywords</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {complaint.keywords.map((kw) => (
                  <span key={kw} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </AgentCard>

        {/* Priority */}
        <AgentCard icon={AlertTriangle} title="Priority Assessment" color="text-amber-600 bg-amber-50">
          <div className="mb-3">
            <PriorityBadge priority={complaint.priority} size="md" />
          </div>
          <Row label="Reasoning" value={complaint.priority_reason} />
        </AgentCard>

        {/* Department Routing */}
        <AgentCard icon={Building2} title="Department Routing" color="text-blue-600 bg-blue-50">
          <Row label="Department" value={complaint.department} />
          <Row label="Reasoning" value={complaint.department_reason} />
        </AgentCard>

        {/* Action Planning */}
        <AgentCard icon={ClipboardList} title="Action Plan" color="text-violet-600 bg-violet-50">
          <Row label="Recommended Action" value={complaint.recommended_action} />
          <Row label="Next Step" value={complaint.next_step} />
          <Row label="Expected Response" value={complaint.expected_response} icon={Clock} />
        </AgentCard>

        {/* Follow-up */}
        <AgentCard icon={BellRing} title="Follow-up" color="text-rose-600 bg-rose-50">
          <Row label="Message" value={complaint.follow_up_message} />
        </AgentCard>

        {/* Summary */}
        <AgentCard icon={FileText} title="Summary Report" color="text-emerald-600 bg-emerald-50">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
            {complaint.final_report}
          </pre>
        </AgentCard>
      </div>

      {/* Action buttons */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">Update Status</h2>
        <div className="flex flex-wrap gap-3">
          {STATUS_OPTIONS.map((status) => {
            const isCurrent = complaint.status === status;
            const Icon = status === 'Resolved' ? CheckCircle2 : status === 'In Progress' ? PlayCircle : Hash;
            return (
              <button
                key={status}
                onClick={() => handleStatus(status)}
                disabled={isCurrent || updating}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                  isCurrent
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {isCurrent ? 'Current' : `Mark ${status}`}
              </button>
            );
          })}
          <button
            onClick={() => setShowFollowUp((s) => !s)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            <BellRing className="h-4 w-4" />
            {showFollowUp ? 'Hide' : 'Create'} Follow-up
          </button>
        </div>

        {showFollowUp && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-500">Follow-up Message</p>
            <p className="mt-1 text-sm text-slate-700">{complaint.follow_up_message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────
function AgentCard({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: typeof ScanText;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      {children}
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
