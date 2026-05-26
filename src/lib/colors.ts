/**
 * Paleta de colores global - Basada en logo Johbry
 */

export const colors = {
  // Primarios (del logo)
  primary: {
    teal: '#0B5E6B',
    lime: '#A8E63D',
    darkTeal: '#0B3D4D',
  },

  // Neutrales
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F5F7FA',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  },

  // Semánticos
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },

  // Gradientes
  gradients: {
    primary: 'linear-gradient(135deg, #0B5E6B 0%, #0B3D4D 100%)',
    accent: 'linear-gradient(135deg, #A8E63D 0%, #7AB55C 100%)',
    mixed: 'linear-gradient(135deg, #0B5E6B 0%, #A8E63D 100%)',
  },
} as const;

// Alias para uso rápido
export const {
  primary,
  neutral,
  semantic,
  gradients,
} = colors;

// Tipo para TypeScript
export type Colors = typeof colors;
