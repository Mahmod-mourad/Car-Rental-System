'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  hoverEffect?: 'scale' | 'lift' | 'glow' | 'none';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';
  border?: boolean;
  borderColor?: string;
};

export default function AnimatedCard({
  children,
  className = '',
  hoverEffect = 'lift',
  rounded = 'lg',
  shadow = 'lg',
  border = false,
  borderColor = 'border-gray-200 dark:border-gray-700',
}: AnimatedCardProps) {
  // Rounded classes
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  // Shadow classes
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    inner: 'shadow-inner',
    none: 'shadow-none',
  };

  // Hover effect variants
  const hoverVariants = {
    scale: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    lift: {
      y: -5,
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      transition: { duration: 0.2 },
    },
    glow: {
      boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)',
      transition: { duration: 0.3 },
    },
    none: {},
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-white dark:bg-gray-800
        ${roundedClasses[rounded]}
        ${shadowClasses[shadow]}
        ${border ? `border ${borderColor}` : ''}
        transition-all duration-300 ease-in-out
        ${className}
      `}
      whileHover={hoverEffect !== 'none' ? hoverVariants[hoverEffect] : {}}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      transition={{ duration: 0.5 }}
    >
      {children}
      {/* Gradient border effect on hover */}
      {hoverEffect === 'glow' && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}

// Card Header Component
type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`border-b border-gray-100 dark:border-gray-700 p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
}

// Card Body Component
type CardBodyProps = {
  children: ReactNode;
  className?: string;
};

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`p-4 md:p-6 ${className}`}>{children}</div>;
}

// Card Footer Component
type CardFooterProps = {
  children: ReactNode;
  className?: string;
};

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`border-t border-gray-100 dark:border-gray-700 p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
}

// Card Image Component
type CardImageProps = {
  src: string;
  alt: string;
  className?: string;
  height?: string | number;
  width?: string | number;
};

export function CardImage({
  src,
  alt,
  className = '',
  height = 'auto',
  width = '100%',
}: CardImageProps) {
  return (
    <div className="relative overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-auto object-cover transition-transform duration-500 hover:scale-105 ${className}`}
        style={{ height, width }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
