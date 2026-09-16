import type { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  tone?: 'default' | 'critical';
  size?: 'sm' | 'md';
}
export function Button(_props: ButtonProps): null { return null; }
export function Input(_props: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }): null { return null; }
export function LegacyBanner(_props: { message: string }): null { return null; }
