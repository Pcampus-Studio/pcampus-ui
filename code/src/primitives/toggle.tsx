import React, { useId } from 'react';

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  label,
  size = 'md',
  disabled = false,
  id: idProp,
}) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const trackW = size === 'sm' ? 32 : 44;
  const trackH = size === 'sm' ? 18 : 24;
  const thumbSz = size === 'sm' ? 12 : 16;
  const thumbOffset = size === 'sm' ? 3 : 4;
  const thumbTranslate = trackW - thumbSz - thumbOffset * 2;

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--pcampus-space-3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'var(--pcampus-font-sans)',
        userSelect: 'none',
      }}
    >
      {/* visually hidden input */}
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-checked={checked}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
        }}
      />
      {/* track */}
      <span
        style={{
          display: 'inline-block',
          position: 'relative',
          width: trackW,
          height: trackH,
          borderRadius: 'var(--pcampus-radius-full)',
          background: checked ? 'var(--pcampus-color-primary)' : 'var(--pcampus-color-neutral)',
          transition: `background var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
          flexShrink: 0,
        }}
      >
        {/* thumb */}
        <span
          style={{
            position: 'absolute',
            top: thumbOffset,
            left: thumbOffset,
            width: thumbSz,
            height: thumbSz,
            borderRadius: 'var(--pcampus-radius-full)',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transform: checked ? `translateX(${thumbTranslate}px)` : 'translateX(0)',
            transition: `transform var(--pcampus-duration-fast) var(--pcampus-ease-default)`,
          }}
        />
      </span>
      {label && (
        <span
          style={{
            fontSize: 'var(--pcampus-text-base)',
            color: disabled ? 'var(--pcampus-color-text-disabled)' : 'var(--pcampus-color-text)',
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
};

Toggle.displayName = 'Toggle';
