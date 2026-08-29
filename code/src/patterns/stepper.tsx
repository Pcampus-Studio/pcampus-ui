import React from 'react';
import { clsx } from 'clsx';
import { Check } from '../icons/curated';
import { Icon } from '../icons/icon';

export type StepperStepStatus = 'done' | 'current' | 'pending';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  status?: StepperStepStatus;
  disabled?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  /** 0-based current step when statuses are not set per step. */
  current?: number;
  /** When set, each step is a control so the user can open that step. */
  onStepClick?: (stepId: string) => void;
  className?: string;
}

function resolveStatus(
  step: StepperStep,
  index: number,
  current?: number
): StepperStepStatus {
  if (step.status) return step.status;
  if (current === undefined) return 'pending';
  if (index < current) return 'done';
  if (index === current) return 'current';
  return 'pending';
}

function StepMarker({
  status,
  index,
}: {
  status: StepperStepStatus;
  index: number;
}) {
  return (
    <span
      className={clsx(
        'flex items-center justify-center w-8 h-8 rounded-pcampus-full text-xs font-semibold shrink-0 border transition-colors',
        status === 'done' &&
          'bg-pcampus-primary border-pcampus-primary text-pcampus-on-primary',
        status === 'current' &&
          'bg-[var(--pcampus-color-primary-subtle)] border-pcampus-primary text-pcampus-primary',
        status === 'pending' &&
          'bg-pcampus-canvas border-pcampus-hairline-strong text-pcampus-muted'
      )}
    >
      {status === 'done' ? <Icon icon={Check} size="sm" /> : index + 1}
    </span>
  );
}

function StepCopy({
  status,
  label,
  description,
}: {
  status: StepperStepStatus;
  label: string;
  description?: string;
}) {
  return (
    <span className="flex flex-col gap-0.5 min-w-0">
      <span
        className={clsx(
          'text-sm font-medium',
          status === 'pending' ? 'text-pcampus-muted' : 'text-pcampus-ink'
        )}
      >
        {label}
      </span>
      {description && (
        <span className="text-xs text-pcampus-muted">{description}</span>
      )}
    </span>
  );
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  current,
  onStepClick,
  className,
}) => (
  <ol
    className={clsx(
      'flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0 font-pcampus-sans list-none m-0 p-0',
      className
    )}
  >
    {steps.map((step, index) => {
      const status = resolveStatus(step, index, current);
      const isLast = index === steps.length - 1;
      const body = (
        <>
          <StepMarker status={status} index={index} />
          <StepCopy
            status={status}
            label={step.label}
            description={step.description}
          />
        </>
      );
      return (
        <li
          key={step.id}
          className={clsx(
            'relative flex sm:flex-1 gap-3 sm:flex-col sm:items-center sm:text-center',
            !isLast && 'sm:pr-4'
          )}
          aria-current={status === 'current' ? 'step' : undefined}
        >
          {!isLast && (
            <span
              aria-hidden
              className={clsx(
                'hidden sm:block absolute top-4 left-[calc(50%+1rem)] right-0 h-px',
                status === 'done' ? 'bg-pcampus-primary' : 'bg-pcampus-hairline-strong'
              )}
            />
          )}
          {onStepClick && !step.disabled ? (
            <button
              type="button"
              aria-label={step.label}
              className="relative z-10 flex flex-1 gap-3 sm:flex-col sm:items-center bg-transparent border-0 p-0 m-0 cursor-pointer font-pcampus-sans text-inherit"
              onClick={() => onStepClick(step.id)}
            >
              {body}
            </button>
          ) : (
            <span
              className={clsx(
                'relative z-10 flex flex-1 gap-3 sm:flex-col sm:items-center',
                step.disabled && 'cursor-not-allowed opacity-60'
              )}
              aria-disabled={step.disabled ? true : undefined}
            >
              {body}
            </span>
          )}
        </li>
      );
    })}
  </ol>
);

Stepper.displayName = 'Stepper';
