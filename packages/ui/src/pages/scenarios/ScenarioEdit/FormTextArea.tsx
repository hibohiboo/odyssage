import React from 'react';

interface FormTextAreaProps {
  readonly id: string;
  readonly label: string;
  readonly value?: string;
  readonly onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly placeholder?: string;
  readonly rows?: number;
  readonly className?: string;
  readonly required?: boolean;
}

export function FormTextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  className = 'w-full',
  required,
}: FormTextAreaProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-stone-700 mb-1"
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`textarea ${className}`}
        rows={rows}
        required={required}
      />
    </div>
  );
}
