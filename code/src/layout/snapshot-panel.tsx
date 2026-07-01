import React from 'react';
import { Skeleton } from '../primitives/skeleton';

export interface SnapshotRow {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
}

export interface SnapshotSection {
  title?: string;
  subtitle?: string;
  rows: SnapshotRow[];
}

export interface SnapshotPanelProps {
  sections: SnapshotSection[];
  loading?: boolean;
  className?: string;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy value"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: copied ? 'var(--pcampus-color-success)' : 'var(--pcampus-color-text-tertiary)',
        fontSize: 12, padding: '0 2px',
        opacity: 0,
        transition: `opacity var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
      }}
      className="pcampus-copy-btn"
    >
      {copied ? '✓' : '⎘'}
    </button>
  );
};

export const SnapshotPanel: React.FC<SnapshotPanelProps> = ({
  sections,
  loading = false,
}) => {
  return (
    <div
      style={{
        fontFamily: 'var(--pcampus-font-sans)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        .pcampus-snapshot-row:hover .pcampus-copy-btn { opacity: 1; }
      `}</style>
      {sections.map((section, si) => (
        <div
          key={si}
          style={{
            paddingTop: si > 0 ? 'var(--pcampus-space-6)' : 0,
            marginTop: si > 0 ? 'var(--pcampus-space-6)' : 0,
            borderTop: si > 0 ? '1px solid var(--pcampus-color-border)' : 'none',
          }}
        >
          {section.title && (
            <div style={{ marginBottom: 'var(--pcampus-space-4)' }}>
              <span
                style={{
                  fontSize: 'var(--pcampus-text-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--pcampus-color-text-tertiary)',
                  fontWeight: 600,
                }}
              >
                {section.title}
              </span>
              {section.subtitle && (
                <span style={{ display: 'block', fontSize: 'var(--pcampus-text-xs)', color: 'var(--pcampus-color-text-tertiary)' }}>
                  {section.subtitle}
                </span>
              )}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--pcampus-space-3)' }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton width="35%" height="12px" />
                    <Skeleton width="45%" height="12px" />
                  </div>
                ))
              : section.rows.map((row, ri) => (
                  <div
                    key={ri}
                    className="pcampus-snapshot-row"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 'var(--pcampus-space-4)',
                      fontSize: 'var(--pcampus-text-sm)',
                    }}
                  >
                    <span style={{ color: 'var(--pcampus-color-text-tertiary)', flexShrink: 0 }}>
                      {row.label}
                    </span>
                    <span
                      style={{
                        color: 'var(--pcampus-color-text)',
                        textAlign: 'right',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--pcampus-space-1)',
                      }}
                    >
                      {row.value}
                      {row.copyable && <CopyButton text={String(row.value)} />}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      ))}
    </div>
  );
};

SnapshotPanel.displayName = 'SnapshotPanel';
