'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  viewport?: {
    once?: boolean;
    amount?: number;
  };
  variants?: Variants;
};

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  viewport = { once: true, amount: 0.25 },
  variants,
}: AnimatedSectionProps) {
  // Default animation variants if none provided
  const defaultVariants = {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0,
    },
    visible: (i: number = 1) => ({
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        delay: delay * i,
        duration: duration,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    }),
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants || defaultVariants}
      custom={1}
    >
      {children}
    </motion.div>
  );
}

type AnimatedTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
};

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  duration = 0.05,
  stagger = 0.02,
}: AnimatedTextProps) {
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: i * delay },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        duration,
      },
    },
  };

  return (
    <motion.div
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}
