import { Bot, Home, ClipboardList, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/cn';

export type Page = 'home' | 'report' | 'analysis' | 'result' | 'dashboard';

interface NavbarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'report', label: 'Report Issue', icon: ClipboardList },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function Navbar({ current, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-cyan-100/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
            <Bot className="h-5 w-5" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 opacity-0 blur-md transition-opacity group-hover:opacity-50" />
          </div>
          <div className="text-left">
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-base font-bold leading-tight text-transparent">CampusCare AI</div>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-[10px] font-semibold uppercase tracking-wider text-transparent">Report. Analyze. Resolve.</div>
          </div>
        </button>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
                  active
                    ? 'text-blue-700'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                {active && (
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 shadow-sm" />
                )}
                <Icon className={cn('relative h-4 w-4 transition-transform', active && 'scale-110')} />
                <span className="relative hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
