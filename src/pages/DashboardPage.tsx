import { useMemo, useState } from 'react';
import { LayoutDashboard, Filter, AlertTriangle, CheckCircle2, Clock, ChevronRight, Trash2, Search, BarChart3, Activity, ShieldCheck } from 'lucide-react';
import type { Complaint } from '@/lib/supabase';
import { PriorityBadge, StatusBadge, CategoryBadge } from '@/components/Badges';
import { EmptyState } from '@/components/States';
import { cn } from '@/lib/cn';

interface DashboardPageProps {
  complaints: Complaint[];
  onSelect: (complaint: Complaint) => void;
  onDelete: (id: string) => Promise<void>;
}

const STAT_CARDS = [
  { key: 'total', label: 'Total Complaints', icon: BarChart3, gradient: 'from-slate-700 to-slate-900', bgGradient: 'from-slate-50 to-slate-100', iconBg: 'from-slate-600 to-slate-800', text: 'text-slate-900', ring: 'ring-slate-200' },
  { key: 'pending', label: 'Pending', icon: Clock, gradient: 'from-blue-600 to-indigo-700', bgGradient: 'from-blue-50 to-indigo-50', iconBg: 'from-blue-500 to-indigo-600', text: 'text-blue-700', ring: 'ring-blue-200' },
  { key: 'high', label: 'High Priority', icon: AlertTriangle, gradient: 'from-orange-500 to-red-600', bgGradient: 'from-orange-50 to-red-50', iconBg: 'from-orange-500 to-red-600', text: 'text-orange-700', ring: 'ring-orange-200' },
  { key: 'resolved', label: 'Resolved', icon: ShieldCheck, gradient: 'from-emerald-500 to-green-700', bgGradient: 'from-emerald-50 to-green-50', iconBg: 'from-emerald-500 to-green-600', text: 'text-emerald-700', ring: 'ring-emerald-200' },
] as const;

const PRIORITIES = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['ALL', 'Submitted', 'Assigned', 'In Progress', 'Resolved'];

export function DashboardPage({ complaints, onSelect, onDelete }: DashboardPageProps) {
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const departments = useMemo(() => {
    const depts = new Set(complaints.map((c) => c.department).filter((d): d is string => Boolean(d)));
    return ['ALL', ...Array.from(depts).sort()];
  }, [complaints]);

  const stats = useMemo(() => {
    const pending = complaints.filter((c) => c.status !== 'Resolved').length;
    const high = complaints.filter((c) => c.priority === 'HIGH' || c.priority === 'CRITICAL').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    return { total: complaints.length, pending, high, resolved };
  }, [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (deptFilter !== 'ALL' && c.department !== deptFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.student_name.toLowerCase().includes(q) ||
          (c.department || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complaints, priorityFilter, statusFilter, deptFilter, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          <LayoutDashboard className="h-3.5 w-3.5" />
          Overview
        </div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-slate-600">Monitor all campus complaints, filter by priority and department, and track resolution progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((card, idx) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof typeof stats];
          return (
            <div
              key={card.key}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br p-5 shadow-sm ring-1 transition-all hover:shadow-lg animate-slide-up',
                card.bgGradient, card.ring,
              )}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.label}</p>
                  <p className={cn('mt-1 text-3xl font-extrabold', card.text)}>{value}</p>
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3', card.iconBg)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className={cn('absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20', card.iconBg)} />
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
            <Filter className="h-4 w-4 text-blue-600" />
            Filters
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <FilterSelect label="Priority" value={priorityFilter} options={PRIORITIES} onChange={setPriorityFilter} />
            <FilterSelect label="Status" value={statusFilter} options={STATUSES} onChange={setStatusFilter} />
            <FilterSelect label="Department" value={deptFilter} options={departments} onChange={setDeptFilter} />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description={complaints.length === 0 ? "No complaints have been submitted yet." : "No complaints match your current filters."}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* Desktop table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/50">
                  <Th>ID</Th>
                  <Th>Location</Th>
                  <Th>Category</Th>
                  <Th>Priority</Th>
                  <Th>Department</Th>
                  <Th>Status</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className="cursor-pointer transition-colors hover:bg-gradient-to-r hover:from-cyan-50/40 hover:to-blue-50/30"
                  >
                    <Td>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-500">
                        #{c.id.slice(0, 8).toUpperCase()}
                      </span>
                    </Td>
                    <Td>
                      <div className="text-sm font-medium text-slate-900">{c.location}</div>
                      <div className="text-xs text-slate-400">{c.student_name}</div>
                    </Td>
                    <Td><CategoryBadge category={c.category} /></Td>
                    <Td><PriorityBadge priority={c.priority} /></Td>
                    <Td><span className="text-sm text-slate-600">{c.department || '—'}</span></Td>
                    <Td><StatusBadge status={c.status} /></Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onSelect(c); }}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 lg:hidden">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelect(c)}
                className="block w-full px-4 py-4 text-left transition-colors hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-400">#{c.id.slice(0, 8).toUpperCase()}</span>
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <p className="mt-1.5 truncate text-sm font-semibold text-slate-900">{c.location}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{c.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <CategoryBadge category={c.category} />
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result count */}
      <p className="mt-4 text-center text-sm text-slate-500">
        Showing <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{complaints.length}</span> complaints
      </p>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────
function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3.5">{children}</td>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt === 'ALL' ? 'All' : opt}</option>
        ))}
      </select>
    </div>
  );
}
