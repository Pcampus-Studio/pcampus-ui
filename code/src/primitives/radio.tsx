import React, { useId } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
}

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioGroupOption[];
  orientation?: 'vertical' | 'horizontal';
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, hint, id: idProp, disabled, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--pcampus-space-1)',
          fontFamily: 'var(--pcampus-font-sans)',
        }}
      >
        <label
          htmlFor={id}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--pcampus-space-3)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <input
            ref={ref}
            type="radio"
            id={id}
            disabled={disabled}
            style={{
              width: 16,
              height: 16,
              cursor: disabled ? 'not-allowed' : 'pointer',
              accentColor: 'var(--pcampus-color-primary)',
              flexShrink: 0,
            }}
            {...props}
          />
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
        {hint && (
          <span style={{ fontSize: 'var(--pcampus-text-xs)', color: 'var(--pcampus-color-text-tertiary)', paddingLeft: '24px' }}>
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  orientation = 'vertical',
}) => {
  return (
    <div
      role="radiogroup"
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: orientation === 'vertical' ? 'var(--pcampus-space-3)' : 'var(--pcampus-space-6)',
        flexWrap: 'wrap',
      }}
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          value={opt.value}
          label={opt.label}
          disabled={opt.disabled}
          checked={value === opt.value}
          onChange={() => onChange?.(opt.value)}
        />
      ))}
    </div>
  );
};

RadioGroup.displayName = 'RadioGroup';
