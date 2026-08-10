import React, { useId } from 'react';
import { clsx } from 'clsx';

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  label,
  size = 'md',
  disabled = false,
  id: idProp,
  className,
}) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <label
      htmlFor={id}
      className={clsx(
        'inline-flex items-center gap-3 select-none font-pcampus-sans',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-checked={checked}
        className="sr-only"
      />
      {/* track */}
      <span
        className={clsx(
          'inline-block relative rounded-pcampus-full shrink-0 transition-colors [transition-duration:var(--pcampus-duration-fast)] [transition-timing-function:var(--pcampus-ease-default)]',
          size === 'sm' ? 'w-8 h-[18px]' : 'w-11 h-6',
          checked ? 'bg-pcampus-primary' : 'bg-[var(--pcampus-color-neutral)]'
        )}
      >
        {/* thumb */}
        <span
          className={clsx(
            'absolute rounded-pcampus-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform [transition-duration:var(--pcampus-duration-fast)] [transition-timing-function:var(--pcampus-ease-default)]',
            size === 'sm' ? 'w-3 h-3 top-[3px] left-[3px]' : 'w-4 h-4 top-1 left-1',
            checked
              ? size === 'sm'
                ? 'translate-x-[14px]'
                : 'translate-x-5'
              : 'translate-x-0'
          )}
        />
      </span>
      {label && (
        <span
          className={clsx(
            'text-base',
            disabled ? 'text-pcampus-muted' : 'text-pcampus-ink'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

Toggle.displayName = 'Toggle';
