import React from 'react';

interface FormInputProps {
  readonly id: string;
  readonly label: string;
  readonly value?: string;
  readonly onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly placeholder?: string;
  readonly className?: string;
}

export function FormInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  className = 'w-full',
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-stone-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input ${className}`}
      />
    </div>
  );
}
