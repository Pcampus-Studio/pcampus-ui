import React, { useCallback, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Upload } from 'lucide-react';

export interface DropzoneProps {
  /** Called with the picked/dropped files. */
  onFiles: (files: File[]) => void;
  /** Native accept string, e.g. "image/*,.pdf". */
  accept?: string;
  /** Allow selecting more than one file. Default true. */
  multiple?: boolean;
  disabled?: boolean;
  title?: React.ReactNode;
  hint?: React.ReactNode;
  /** Optional leading icon override (defaults to an Upload glyph). */
  icon?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Generic drag-and-drop upload surface. Click to browse or drop files.
 * Purely presentational + file selection — the caller handles the upload.
 * Styling ships as `.pc-dropzone*` classes in the package stylesheet.
 */
export function Dropzone({
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  title = 'Drag & drop files here',
  hint = 'or click to browse',
  icon,
  className,
  'aria-label': ariaLabel,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const pick = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const files = Array.from(list);
      onFiles(multiple ? files : files.slice(0, 1));
    },
    [multiple, onFiles],
  );

  return (
    <div
      className={clsx(
        'pc-dropzone',
        over && 'pc-dropzone--over',
        disabled && 'pc-dropzone--disabled',
        className,
      )}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel ?? 'Upload files'}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setOver(false);
      }}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setOver(false);
        pick(e.dataTransfer.files);
      }}
    >
      <span className="pc-dropzone__ic">
        {icon ?? <Upload size={20} aria-hidden />}
      </span>
      <span className="pc-dropzone__title">{title}</span>
      {hint ? <span className="pc-dropzone__hint">{hint}</span> : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="pc-dropzone__input"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

Dropzone.displayName = 'Dropzone';
