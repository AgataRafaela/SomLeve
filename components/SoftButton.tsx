'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface SoftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'circle' | 'primary';
}

export function SoftButton({ children, variant = 'circle', className = '', ...props }: SoftButtonProps) {
  return <button {...props} className={`soft-button soft-button--${variant} ${className}`}>{children}</button>;
}
