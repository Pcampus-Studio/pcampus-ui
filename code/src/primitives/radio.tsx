import React, { useId } from 'react';
import { clsx } from 'clsx';

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
  className?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, hint, id: idProp, disabled, className, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    return (
      <div className={clsx('flex flex-col gap-1 font-pcampus-sans', className)}>
        <label
          htmlFor={id}
          className={clsx(
            'inline-flex items-center gap-3',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          )}
        >
          <input
            ref={ref}
            type="radio"
            id={id}
            disabled={disabled}
            className={clsx(
              'w-4 h-4 accent-pcampus-primary shrink-0',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
            {...props}
          />
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
        {hint && (
          <span className="text-xs text-pcampus-muted pl-7">
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
  className,
}) => {
  return (
    <div
      role="radiogroup"
      className={clsx(
        'flex flex-wrap',
        orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row gap-6',
        className
      )}
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
