import React from 'react';
import { clsx } from 'clsx';
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
      className={clsx(
        'bg-transparent border-none cursor-pointer text-xs px-[2px] transition-opacity duration-fast ease-default opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100',
        copied ? 'text-pcampus-success' : 'text-pcampus-muted'
      )}
    >
      {copied ? '✓' : '⎘'}
    </button>
  );
};

export const SnapshotPanel: React.FC<SnapshotPanelProps> = ({
  sections,
  loading = false,
  className,
}) => {
  return (
    <div className={clsx('font-pcampus-sans flex flex-col', className)}>
      {sections.map((section, si) => (
        <div
          key={si}
          className={clsx(
            si > 0 && 'pt-6 mt-6 border-t border-pcampus-hairline'
          )}
        >
          {section.title && (
            <div className="mb-4">
              <span className="text-[11px] uppercase tracking-[0.05em] text-pcampus-muted font-semibold">
                {section.title}
              </span>
              {section.subtitle && (
                <span className="block text-[11px] text-pcampus-muted">
                  {section.subtitle}
                </span>
              )}
            </div>
          )}
          <div className="flex flex-col gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton width="35%" height="12px" />
                    <Skeleton width="45%" height="12px" />
                  </div>
                ))
              : section.rows.map((row, ri) => (
                  <div
                    key={ri}
                    className="group/row flex justify-between items-center gap-4 text-sm"
                  >
                    <span className="text-pcampus-muted shrink-0">
                      {row.label}
                    </span>
                    <span className="text-pcampus-ink text-right flex items-center gap-1">
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
