
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-300 rounded-[13px] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed uppercase text-[11px] tracking-[0.15em]";
  
  const variants = {
    primary: "bg-accent text-background hover:bg-white active:scale-95 shadow-lg shadow-accent/10",
    secondary: "bg-surface border border-white/10 text-text-primary hover:border-accent/40 active:scale-95",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-surface/50 active:scale-95",
    destructive: "bg-destructive text-white hover:opacity-90 active:scale-95 shadow-lg shadow-destructive/20",
  };

  const sizes = {
    sm: "px-5 py-2.5",
    md: "px-8 py-3.5",
    lg: "px-12 py-5 text-sm",
    icon: "p-3 aspect-square",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
