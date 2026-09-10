import { ArrowRight, Bot, Zap, Building2, ClipboardList, BellRing, ShieldCheck, Workflow, Activity, ChevronRight, Wifi, Zap as ElectricIcon, Wrench, Droplets, FlaskConical, Sparkles } from 'lucide-react';
import type { Page } from '@/components/Navbar';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  stats: { total: number; pending: number; high: number; resolved: number } | null;
}

const FEATURES = [
  { icon: Bot, title: 'AI Analysis', description: 'Smart agents parse and understand every complaint automatically.', gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/30' },
  { icon: Zap, title: 'Smart Priority', description: 'Urgency detection from Low to Critical based on complaint context.', gradient: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/30' },
  { icon: Building2, title: 'Automatic Routing', description: 'Complaints routed to the right department without manual effort.', gradient: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/30' },
  { icon: ClipboardList, title: 'Action Planning', description: 'Each complaint gets a recommended action plan and next steps.', gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/30' },
  { icon: BellRing, title: 'Status Tracking', description: 'Follow-up agents keep complaints moving until resolution.', gradient: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/30' },
  { icon: ShieldCheck, title: 'Final Resolution', description: 'A summary agent compiles everything into a clear report.', gradient: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/30' },
];

const AGENT_STEPS = [
  { icon: Bot, label: 'Complaint Analysis', gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-50', text: 'text-cyan-700', border: 'border-cyan-200/60' },
  { icon: Zap, label: 'Priority Detection', gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-50', text: 'text-amber-700', border: 'border-amber-200/60' },
  { icon: Building2, label: 'Department Routing', gradient: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50', text: 'text-blue-700', border: 'border-blue-200/60' },
  { icon: ClipboardList, label: 'Action Planning', gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50', text: 'text-violet-700', border: 'border-violet-200/60' },
  { icon: BellRing, label: 'Follow-up', gradient: 'from-rose-500 to-pink-600', bg: 'from-rose-50 to-pink-50', text: 'text-rose-700', border: 'border-rose-200/60' },
  { icon: Activity, label: 'Summary Report', gradient: 'from-emerald-500 to-green-600', bg: 'from-emerald-50 to-green-50', text: 'text-emerald-700', border: 'border-emerald-200/60' },
];

const ISSUE_TYPES = [
  { icon: Wifi, label: 'Wi-Fi Issues', color: 'text-sky-600 bg-sky-50' },
  { icon: ElectricIcon, label: 'Electrical', color: 'text-amber-600 bg-amber-50' },
  { icon: Droplets, label: 'Water Problems', color: 'text-blue-600 bg-blue-50' },
  { icon: FlaskConical, label: 'Lab Equipment', color: 'text-violet-600 bg-violet-50' },
  { icon: Sparkles, label: 'Cleanliness', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Wrench, label: 'Maintenance', color: 'text-rose-600 bg-rose-50' },
];

export function HomePage({ onNavigate, stats }: HomePageProps) {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-50 via-blue-50/40 to-white" />
        <div className="absolute left-1/4 top-0 -z-10 h-[400px] w-[400px] animate-blob rounded-full bg-gradient-to-br from-cyan-300/30 to-blue-400/20 blur-3xl" />
        <div className="absolute right-1/4 top-20 -z-10 h-[350px] w-[350px] animate-blob-slow rounded-full bg-gradient-to-br from-violet-300/20 to-pink-400/15 blur-3xl" />
        <div className="absolute left-1/2 top-40 -z-10 h-[300px] w-[300px] animate-blob rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-400/15 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur-md animate-fade-in">
              <Workflow className="h-3.5 w-3.5" />
              6 AI Agents Working Together
            </div>
            <h1 className="animate-slide-up text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Campus issues,{' '}
              <span className="animated-gradient-bg bg-clip-text text-transparent">
                resolved intelligently
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Students report campus problems — broken fans, Wi-Fi outages, water leaks — and a team of AI agents
              automatically analyzes, prioritizes, routes, and tracks each complaint to resolution.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => onNavigate('report')}
                className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/40 hover:brightness-110"
              >
                <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                Report an Issue
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
              >
                View Dashboard
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Issue type pills */}
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
            {ISSUE_TYPES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${item.color} transition-transform hover:scale-105`}>
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
              );
            })}
          </div>

          {/* Stats bar */}
          {stats && (
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Total', value: stats.total, gradient: 'from-slate-700 to-slate-900', text: 'text-slate-900', bg: 'from-slate-50 to-slate-100' },
                { label: 'Pending', value: stats.pending, gradient: 'from-blue-500 to-indigo-600', text: 'text-blue-700', bg: 'from-blue-50 to-indigo-50' },
                { label: 'High Priority', value: stats.high, gradient: 'from-orange-500 to-red-600', text: 'text-orange-700', bg: 'from-orange-50 to-red-50' },
                { label: 'Resolved', value: stats.resolved, gradient: 'from-emerald-500 to-green-600', text: 'text-emerald-700', bg: 'from-emerald-50 to-green-50' },
              ].map((s, idx) => (
                <div
                  key={s.label}
                  className="group relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br p-5 text-center shadow-sm backdrop-blur-md transition-all hover:shadow-lg animate-slide-up"
                  style={{ animationDelay: `${idx * 80}ms`, backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-80`} />
                  <div className="relative">
                    <div className={`mb-1 inline-block bg-gradient-to-br ${s.gradient} bg-clip-text text-3xl font-extrabold text-transparent`}>{s.value}</div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Agent Workflow Visualization */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Workflow className="h-3.5 w-3.5" />
            Pipeline
          </div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How the AI Agent Pipeline Works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Every complaint flows through six specialized AI agents in sequence — from understanding the problem to generating a final resolution report.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          {AGENT_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="group relative animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`flex flex-col items-center gap-3 rounded-2xl border ${step.border} bg-gradient-to-br ${step.bg} p-5 text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient} text-white shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${step.text}`}>Agent {i + 1}</div>
                  <div className="text-sm font-semibold text-slate-800">{step.label}</div>
                </div>
                {i < AGENT_STEPS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                    <div className={`h-0.5 w-6 bg-gradient-to-r ${step.gradient} opacity-40`} />
                    <ChevronRight className="absolute -top-2 left-1 h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            Features
          </div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Everything you need to manage campus complaints</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            From submission to resolution, the entire workflow is automated by AI.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl animate-slide-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-5 transition-opacity group-hover:opacity-10`} />
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-lg ${f.glow} transition-transform group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-8 py-14 text-center shadow-2xl">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-10 top-0 h-48 w-48 animate-blob rounded-full bg-cyan-500 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-48 w-48 animate-blob-slow rounded-full bg-violet-500 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 animate-blob rounded-full bg-blue-500 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to see it in action?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Submit a complaint and watch the AI agents process it in real time.
            </p>
            <button
              onClick={() => onNavigate('report')}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:shadow-2xl hover:brightness-110"
            >
              Try it now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
