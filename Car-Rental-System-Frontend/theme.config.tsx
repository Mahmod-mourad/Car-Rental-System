import { type Config } from "tailwindcss"

export const themeConfig = {
  // Enhanced Blue color palette
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    accent: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
  },
  
  // Enhanced Typography
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    display: ['Poppins', 'Inter', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  
  // Border radius
  borderRadius: {
    none: '0px',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
    full: '9999px',
  },
  
  // Enhanced Box shadows
  boxShadow: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 10px 10px -5px rgb(0 0 0 / 0.02)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
    '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 15px rgba(14, 165, 233, 0.5)',
    'glow-md': '0 0 25px rgba(14, 165, 233, 0.6)',
    'glow-lg': '0 0 35px rgba(14, 165, 233, 0.7)',
    none: 'none',
  },
  
  // Enhanced Animation
  animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
    'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    'spin-slow': 'spin 3s linear infinite',
  },
  
  // Keyframes
  keyframes: {
    'accordion-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' },
    },
    'accordion-up': {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' },
    },
    'pulse': {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '.5' },
    },
    'spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  },
} satisfies Config

export default themeConfig
