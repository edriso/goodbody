import { NavLink, Outlet } from 'react-router-dom';
import { useSettings } from '@/hooks/use-settings';
import { useApplyTheme } from '@/hooks/use-apply-theme';
import { Player } from '@/player/player';
import { Icon, type IconName } from './icon';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Today', icon: 'today', end: true },
  { to: '/move', label: 'Move', icon: 'move' },
  { to: '/program', label: 'Program', icon: 'program' },
  { to: '/setup', label: 'Setup', icon: 'setup' },
];

/**
 * The shell around every signed-in screen: a side rail on desktop, a bottom
 * bar on mobile, the routed screen in the middle, and the player overlay.
 */
export function AppLayout() {
  const { data: settings } = useSettings();
  useApplyTheme(settings);

  return (
    <div className="gb-app">
      {/* Desktop side rail */}
      <nav className="gb-rail" aria-label="Main">
        <div className="gb-brand">
          <span className="gb-logo">
            <Icon name="leaf" size={20} />
          </span>
          <span className="gb-brand-name">Good Bodies</span>
        </div>
        <div className="gb-rail-items">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => 'gb-navitem gb-tap' + (isActive ? ' is-on' : '')}
            >
              <Icon name={item.icon} size={21} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="gb-rail-foot">
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10.5,
              color: 'var(--text-faint)',
              lineHeight: 1.5,
            }}
          >
            Guidance from NHS, Mayo Clinic and AAOS. Not medical advice.
          </div>
        </div>
      </nav>

      {/* Routed screen */}
      <main className="gb-main">
        <div className="gb-col">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom bar */}
      <nav className="gb-bottom" aria-label="Main">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 'gb-tabbtn gb-tap' + (isActive ? ' is-on' : '')}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* The full-screen player shows itself when a routine is active. */}
      <Player />
    </div>
  );
}
