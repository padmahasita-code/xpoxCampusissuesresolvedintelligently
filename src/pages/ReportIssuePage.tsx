import { useState } from 'react';
import { Send, User, MapPin, Tag, MessageSquare, AlertCircle, Wifi, Zap, Wrench, Droplets, FlaskConical, Sparkles, Lightbulb } from 'lucide-react';
import type { NewComplaint } from '@/lib/supabase';

interface ReportIssuePageProps {
  onSubmit: (complaint: NewComplaint) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

const CATEGORIES = [
  { label: 'IT / Wi-Fi', icon: Wifi, gradient: 'from-sky-500 to-cyan-600', active: 'border-sky-500 bg-gradient-to-br from-sky-50 to-cyan-50 text-sky-700 shadow-md shadow-sky-500/10' },
  { label: 'Electrical', icon: Zap, gradient: 'from-amber-500 to-orange-600', active: 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 shadow-md shadow-amber-500/10' },
  { label: 'Maintenance', icon: Wrench, gradient: 'from-slate-500 to-slate-700', active: 'border-slate-500 bg-gradient-to-br from-slate-50 to-gray-50 text-slate-700 shadow-md shadow-slate-500/10' },
  { label: 'Water / Sanitation', icon: Droplets, gradient: 'from-blue-500 to-indigo-600', active: 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-md shadow-blue-500/10' },
  { label: 'Laboratory', icon: FlaskConical, gradient: 'from-violet-500 to-purple-600', active: 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 text-violet-700 shadow-md shadow-violet-500/10' },
  { label: 'Cleanliness', icon: Sparkles, gradient: 'from-emerald-500 to-green-600', active: 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700 shadow-md shadow-emerald-500/10' },
];

const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D', 'Library', 'Auditorium', 'Sports Complex'];

const EXAMPLES = [
  'Wi-Fi is not working in the Block A computer lab and students cannot access their online lab materials.',
  'The ceiling fan in room 204 is not working and the lights are flickering.',
  'There is a water leakage from the pipe in the Block B washroom. Water is overflowing.',
  'The microscope in the biology lab is broken and cannot be used for the practical exam.',
];

const SECTION_STYLES = [
  { icon: User, gradient: 'from-cyan-500 to-blue-600', text: 'text-cyan-600', bg: 'from-cyan-50/50 to-transparent' },
  { icon: MapPin, gradient: 'from-blue-500 to-indigo-600', text: 'text-blue-600', bg: 'from-blue-50/50 to-transparent' },
  { icon: Tag, gradient: 'from-violet-500 to-purple-600', text: 'text-violet-600', bg: 'from-violet-50/50 to-transparent' },
  { icon: MessageSquare, gradient: 'from-rose-500 to-pink-600', text: 'text-rose-600', bg: 'from-rose-50/50 to-transparent' },
];

export function ReportIssuePage({ onSubmit, isSubmitting, error }: ReportIssuePageProps) {
  const [form, setForm] = useState<NewComplaint>({
    student_name: '',
    student_id: '',
    block: '',
    location: '',
    category: '',
    description: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = (field: keyof NewComplaint, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const valid = form.student_name.trim() && form.location.trim() && form.category && form.description.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || isSubmitting) return;
    onSubmit(form);
  };

  const useExample = (example: string) => {
    setForm((prev) => ({ ...prev, description: example }));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          <Lightbulb className="h-3.5 w-3.5" />
          New Complaint
        </div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Report an Issue</h1>
        <p className="mt-2 text-slate-600">
          Fill out the form below. Once submitted, our AI agents will automatically analyze, prioritize, and route your complaint.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Info */}
        <FormSection icon={User} gradient="from-cyan-500 to-blue-600" title="Student Information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Student Name"
              required
              value={form.student_name}
              onChange={(v) => update('student_name', v)}
              onBlur={() => setTouched((t) => ({ ...t, student_name: true }))}
              error={touched.student_name && !form.student_name.trim() ? 'Name is required' : undefined}
              placeholder="e.g. Padma Sharma"
            />
            <Field
              label="Student ID"
              value={form.student_id}
              onChange={(v) => update('student_id', v)}
              placeholder="e.g. CS21-042"
            />
          </div>
        </FormSection>

        {/* Location */}
        <FormSection icon={MapPin} gradient="from-blue-500 to-indigo-600" title="Location">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Block / Building"
              value={form.block}
              onChange={(v) => update('block', v)}
              options={BLOCKS}
              placeholder="Select a block"
            />
            <Field
              label="Specific Location"
              required
              value={form.location}
              onChange={(v) => update('location', v)}
              onBlur={() => setTouched((t) => ({ ...t, location: true }))}
              error={touched.location && !form.location.trim() ? 'Location is required' : undefined}
              placeholder="e.g. Room 204, Computer Lab"
            />
          </div>
        </FormSection>

        {/* Category */}
        <FormSection icon={Tag} gradient="from-violet-500 to-purple-600" title="Category">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = form.category === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => update('category', cat.label)}
                  className={`group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? cat.active
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${cat.gradient} text-white shadow-sm transition-transform ${isActive ? 'scale-110' : 'opacity-60 group-hover:opacity-100'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-left leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
          {touched.category && !form.category && (
            <p className="mt-2 text-xs font-medium text-red-600">Please select a category</p>
          )}
        </FormSection>

        {/* Description */}
        <FormSection icon={MessageSquare} gradient="from-rose-500 to-pink-600" title="Complaint Description">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, description: true }))}
            rows={4}
            required
            placeholder="Describe the issue in detail..."
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
          {touched.description && !form.description.trim() && (
            <p className="mt-2 text-xs font-medium text-red-600">Description is required</p>
          )}

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => useExample(ex)}
                  className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/50 px-3 py-1.5 text-xs text-slate-600 transition-all hover:border-cyan-300 hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 hover:shadow-sm"
                >
                  {ex.length > 40 ? ex.slice(0, 40) + '...' : ex}
                </button>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={!valid || isSubmitting}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Complaint
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Form Section wrapper ────────────────────────────────
function FormSection({ icon: Icon, gradient, title, children }: { icon: typeof User; gradient: string; title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm`}>
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Field components ────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-500/20'
        }`}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
