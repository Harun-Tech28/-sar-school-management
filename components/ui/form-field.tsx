'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Info } from 'lucide-react';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  validation?: ValidationRule[];
  rows?: number;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
}

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  icon,
  tooltip,
  validation = [],
  rows = 4,
  maxLength,
  autoComplete,
  className = '',
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced validation
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value && validation.length > 0) {
      debounceRef.current = setTimeout(() => {
        validateField(value);
      }, 300);
    } else {
      setInternalError('');
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, validation]);

  const validateField = (val: string) => {
    for (const rule of validation) {
      if (!rule.validate(val)) {
        setInternalError(rule.message);
        return false;
      }
    }
    setInternalError('');
    return true;
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    onChange(newValue);
  };

  const displayError = error || internalError;
  const hasValue = value.length > 0;
  const showFloatingLabel = isFocused || hasValue;

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border transition-all duration-150
    ${icon ? 'pl-11' : ''}
    ${displayError 
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
      : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${type === 'textarea' ? 'resize-none' : ''}
    focus:outline-none
    placeholder-transparent
  `;

  const labelClasses = `
    absolute left-4 transition-all duration-150 pointer-events-none
    ${icon ? 'left-11' : 'left-4'}
    ${showFloatingLabel 
      ? 'top-1 text-xs text-gray-600' 
      : 'top-3.5 text-base text-gray-500'
    }
    ${isFocused && !displayError ? 'text-primary' : ''}
    ${displayError ? 'text-red-600' : ''}
  `;

  return (
    <div className={`relative ${className}`}>
      {/* Label with tooltip */}
      <div className="flex items-center gap-2 mb-1">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {tooltip && (
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="More information"
            >
              <Info className="w-4 h-4" />
            </button>
            
            {showTooltip && (
              <div className="absolute left-0 top-6 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg animate-fadeIn">
                {tooltip}
                <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Floating label */}
        <label htmlFor={name} className={labelClasses}>
          {placeholder || label}
        </label>

        {/* Input or Textarea */}
        {type === 'textarea' ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            rows={rows}
            maxLength={maxLength}
            className={inputClasses}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            autoComplete={autoComplete}
            className={inputClasses}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          />
        )}

        {/* Character count */}
        {maxLength && type === 'textarea' && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <div
          id={`${name}-error`}
          className="flex items-center gap-1 mt-1 text-sm text-red-600 animate-slideDown"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      {/* Helper text */}
      {!displayError && helperText && (
        <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => regex.test(value),
    message,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validate: (value) => /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
    message,
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  number: (message = 'Please enter a valid number'): ValidationRule => ({
    validate: (value) => !isNaN(Number(value)) && value.trim() !== '',
    message,
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validate: (value) => Number(value) >= min,
    message: message || `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validate: (value) => Number(value) <= max,
    message: message || `Must be no more than ${max}`,
  }),
};
