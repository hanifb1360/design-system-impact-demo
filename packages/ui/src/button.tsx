import { forwardRef, memo, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
}

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size, ...props },
  ref
) {
  return <button ref={ref} data-variant={variant} data-size={size} {...props} />;
}));
