'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  hoverEffect?: 'shrink' | 'grow' | 'pulse' | 'none';
};

export default function GradientButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  rounded = 'md',
  hoverEffect = 'grow',
  ...props
}: GradientButtonProps) {
  // Button size classes
  const sizeClasses = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-2.5',
    lg: 'text-lg px-8 py-3',
  };

  // Button variant classes
  const variantClasses = {
    primary: 'from-blue-500 to-blue-600 text-white',
    secondary: 'from-gray-500 to-gray-600 text-white',
    accent: 'from-emerald-400 to-emerald-600 text-white',
  };

  // Rounded classes
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Hover effect variants
  const hoverVariants = {
    shrink: { scale: 0.95 },
    grow: { scale: 1.05 },
    pulse: { scale: [1, 1.05, 1], transition: { duration: 1, repeat: Infinity } },
    none: {},
  };

  return (
    <motion.button
      whileHover={hoverEffect !== 'none' ? hoverVariants[hoverEffect] : {}}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden
        bg-gradient-to-r ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${fullWidth ? 'w-full' : 'w-auto'}
        font-medium tracking-wide
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:shadow-blue-500/30
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 hover:opacity-20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.2 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}

// Shimmer effect button
const ShineOverlay = () => (
  <motion.span
    className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
    initial={{ x: '-100%' }}
    animate={{ x: '300%' }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

// Export a special button with shine effect
export function ShineButton(props: GradientButtonProps) {
  return (
    <GradientButton
      {...props}
      className={`relative overflow-hidden ${props.className || ''}`}
    >
      <ShineOverlay />
      <span className="relative z-10">{props.children}</span>
    </GradientButton>
  );
}
