import { useMemo, useState } from 'react';
import { LayoutDashboard, Filter, AlertTriangle, CheckCircle2, Clock, ChevronRight, Trash2, Search } from 'lucide-react';
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
  { key: 'total', label: 'Total Complaints', icon: LayoutDashboard, color: 'from-slate-600 to-slate-800', bg: 'bg-slate-50', text: 'text-slate-900' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', text: 'text-blue-700' },
  { key: 'high', label: 'High Priority', icon: AlertTriangle, color: 'from-orange-500 to-red-600', bg: 'bg-orange-50', text: 'text-orange-700' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, color: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', text: 'text-emerald-700' },
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
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-slate-600">Monitor all campus complaints, filter by priority and department, and track resolution progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof typeof stats];
          return (
            <div
              key={card.key}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.label}</p>
                  <p className={cn('mt-1 text-3xl font-extrabold', card.text)}>{value}</p>
                </div>
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', card.bg)}>
                  <Icon className={cn('h-6 w-6', card.text)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
          <Filter className="h-4 w-4 text-cyan-600" />
          Filters
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {/* Priority filter */}
          <FilterSelect label="Priority" value={priorityFilter} options={PRIORITIES} onChange={setPriorityFilter} />

          {/* Status filter */}
          <FilterSelect label="Status" value={statusFilter} options={STATUSES} onChange={setStatusFilter} />

          {/* Department filter */}
          <FilterSelect label="Department" value={deptFilter} options={departments} onChange={setDeptFilter} />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description={complaints.length === 0 ? "No complaints have been submitted yet." : "No complaints match your current filters."}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
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
                    className="cursor-pointer transition-colors hover:bg-cyan-50/40"
                  >
                    <Td>
                      <span className="font-mono text-xs font-semibold text-slate-500">
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
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
                className="block w-full px-4 py-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-400">#{c.id.slice(0, 8).toUpperCase()}</span>
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
        Showing {filtered.length} of {complaints.length} complaints
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
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt === 'ALL' ? 'All' : opt}</option>
        ))}
      </select>
    </div>
  );
}
