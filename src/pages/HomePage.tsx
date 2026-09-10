import { ArrowRight, Bot, Zap, Building2, ClipboardList, BellRing, ShieldCheck, Workflow, Activity, ChevronRight } from 'lucide-react';
import type { Page } from '@/components/Navbar';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  stats: { total: number; pending: number; high: number; resolved: number } | null;
}

const FEATURES = [
  { icon: Bot, title: 'AI Analysis', description: 'Smart agents parse and understand every complaint automatically.' },
  { icon: Zap, title: 'Smart Priority', description: 'Urgency detection from Low to Critical based on complaint context.' },
  { icon: Building2, title: 'Automatic Routing', description: 'Complaints routed to the right department without manual effort.' },
  { icon: ClipboardList, title: 'Action Planning', description: 'Each complaint gets a recommended action plan and next steps.' },
  { icon: BellRing, title: 'Status Tracking', description: 'Follow-up agents keep complaints moving until resolution.' },
  { icon: ShieldCheck, title: 'Final Resolution', description: 'A summary agent compiles everything into a clear report.' },
];

const AGENT_STEPS = [
  { icon: Bot, label: 'Complaint Analysis', color: 'text-cyan-600 bg-cyan-50' },
  { icon: Zap, label: 'Priority Detection', color: 'text-amber-600 bg-amber-50' },
  { icon: Building2, label: 'Department Routing', color: 'text-blue-600 bg-blue-50' },
  { icon: ClipboardList, label: 'Action Planning', color: 'text-violet-600 bg-violet-50' },
  { icon: BellRing, label: 'Follow-up', color: 'text-rose-600 bg-rose-50' },
  { icon: Activity, label: 'Summary Report', color: 'text-emerald-600 bg-emerald-50' },
];

export function HomePage({ onNavigate, stats }: HomePageProps) {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white" />
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-cyan-200/30 to-blue-300/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-cyan-700 shadow-sm backdrop-blur">
              <Workflow className="h-3.5 w-3.5" />
              6 AI Agents Working Together
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Campus issues,{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
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
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/30 hover:brightness-105"
              >
                Report an Issue
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                View Dashboard
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stats bar */}
          {stats && (
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Total', value: stats.total, color: 'text-slate-900' },
                { label: 'Pending', value: stats.pending, color: 'text-blue-600' },
                { label: 'High Priority', value: stats.high, color: 'text-orange-600' },
                { label: 'Resolved', value: stats.resolved, color: 'text-emerald-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 text-center shadow-sm backdrop-blur">
                  <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Agent Workflow Visualization */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">How the AI Agent Pipeline Works</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Every complaint flows through six specialized AI agents in sequence — from understanding the problem to generating a final resolution report.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-6">
          {AGENT_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:shadow-md">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Agent {i + 1}</div>
                  <div className="text-sm font-semibold text-slate-800">{step.label}</div>
                </div>
                {i < AGENT_STEPS.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 lg:block">
                    <ChevronRight className="h-5 w-5 text-slate-300" />
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
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Everything you need to manage campus complaints</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            From submission to resolution, the entire workflow is automated by AI.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-14 text-center shadow-xl">
          <div className="absolute inset-0 -z-0 opacity-20">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-cyan-500 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-blue-500 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to see it in action?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Submit a complaint and watch the AI agents process it in real time.
            </p>
            <button
              onClick={() => onNavigate('report')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
            >
              Try it now
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
