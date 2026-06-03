import { useId, useState } from 'react';
import { Card } from './card';
import { Icon } from './icon';

interface SafetyNoteProps {
  safety: string;
  expanded?: boolean;
}

/**
 * A collapsible safety note. Built as an accessible disclosure: the button
 * controls a region and reports its open state to screen readers.
 */
export function SafetyNote({ safety, expanded = false }: SafetyNoteProps) {
  const [open, setOpen] = useState(expanded);
  const regionId = useId();

  return (
    <Card pad={16} style={{ borderColor: 'var(--coral-line)' }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={regionId}
        className="gb-tap"
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          font: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          textAlign: 'left',
        }}
      >
        <span style={{ color: 'var(--coral)', flexShrink: 0 }}>
          <Icon name="info" size={20} />
        </span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>Move safely, read this once</span>
        <span
          style={{
            color: 'var(--text-faint)',
            transform: open ? 'rotate(90deg)' : 'none',
            transition: 'transform .25s',
          }}
        >
          <Icon name="chevR" size={18} />
        </span>
      </button>
      {open && (
        <p
          id={regionId}
          className="gb-fade"
          style={{
            margin: '12px 0 0',
            fontSize: 13,
            lineHeight: 1.55,
            color: 'var(--text-dim)',
            textWrap: 'pretty',
          }}
        >
          {safety}
        </p>
      )}
    </Card>
  );
}
