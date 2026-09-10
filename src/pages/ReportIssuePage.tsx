import { useState } from 'react';
import { Send, User, MapPin, Tag, MessageSquare, AlertCircle } from 'lucide-react';
import type { NewComplaint } from '@/lib/supabase';

interface ReportIssuePageProps {
  onSubmit: (complaint: NewComplaint) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

const CATEGORIES = [
  'IT / Wi-Fi',
  'Electrical',
  'Maintenance',
  'Water / Sanitation',
  'Laboratory',
  'Cleanliness',
];

const BLOCKS = ['Block A', 'Block B', 'Block C', 'Block D', 'Library', 'Auditorium', 'Sports Complex'];

const EXAMPLES = [
  'Wi-Fi is not working in the Block A computer lab and students cannot access their online lab materials.',
  'The ceiling fan in room 204 is not working and the lights are flickering.',
  'There is a water leakage from the pipe in the Block B washroom. Water is overflowing.',
  'The microscope in the biology lab is broken and cannot be used for the practical exam.',
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Report an Issue</h1>
        <p className="mt-2 text-slate-600">
          Fill out the form below. Once submitted, our AI agents will automatically analyze, prioritize, and route your complaint.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Student Information</h2>
          </div>
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
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cyan-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Location</h2>
          </div>
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
        </div>

        {/* Category */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-cyan-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Category</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => update('category', cat)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  form.category === cat
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {touched.category && !form.category && (
            <p className="mt-2 text-xs font-medium text-red-600">Please select a category</p>
          )}
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-cyan-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Complaint Description</h2>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, description: true }))}
            rows={4}
            required
            placeholder="Describe the issue in detail..."
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
          {touched.description && !form.description.trim() && (
            <p className="mt-2 text-xs font-medium text-red-600">Description is required</p>
          )}

          {/* Example complaints */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => useExample(ex)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  {ex.length > 40 ? ex.slice(0, 40) + '...' : ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={!valid || isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting ? 'Analyzing...' : 'Analyze Complaint'}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
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
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
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
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
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
