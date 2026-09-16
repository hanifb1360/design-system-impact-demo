import type { InputHTMLAttributes } from 'react';
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { invalid?: boolean }
export function Input({ invalid, ...props }: InputProps) { return <input aria-invalid={invalid} {...props} />; }
