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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="text-base font-bold leading-tight text-slate-900">CampusCare AI</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Report. Analyze. Resolve.</div>
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
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
