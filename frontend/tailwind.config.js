/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Luxury palette
        primary: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#e8dfd1',
          300: '#d4c5aa',
          400: '#c4a876',
          500: '#a68864',
          600: '#8a6e4f',
          700: '#6b5439',
          800: '#544138',
          900: '#453533'
        },
        gold: {
          50: '#fefcf0',
          100: '#fef5d6',
          200: '#fce6a8',
          300: '#f9d670',
          400: '#f6c843',
          500: '#d4a824',
          600: '#a68000',
          700: '#6b5400',
          800: '#4a3a00',
          900: '#3a2a00'
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        accent: '#e8dfd1'
      },
      backgroundImage: {
        'gradient-luxury':
          'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0a0e27 100%)',
        'gradient-gold':
          'linear-gradient(135deg, #d4a824 0%, #f6c843 50%, #d4a824 100%)',
        'gradient-hover':
          'linear-gradient(135deg, #374151 0%, #1f2937 50%, #111827 100%)',
        'gradient-card':
          'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.8) 100%)'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '40px'
      },
      boxShadow: {
        'glass':
          '0 8px 32px 0 rgba(31, 41, 55, 0.37), 0 0 1px 0 rgba(17, 24, 39, 0.35)',
        'gold': '0 8px 32px 0 rgba(212, 168, 36, 0.2)',
        'glow': '0 0 20px rgba(212, 168, 36, 0.3)',
        'inner-glass': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        accent: ['Cormorant Garamond', 'serif']
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }]
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(212, 168, 36, 0.5)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(212, 168, 36, 0.8)'
          }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      },
      spacing: {
        'gutter': '2rem',
        'section': '4rem'
      },
      opacity: {
        5: '0.05',
        10: '0.1',
        15: '0.15',
        25: '0.25',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        75: '0.75',
        85: '0.85',
        95: '0.95'
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.backdrop-blur-xs': {
          backdropFilter: 'blur(2px)'
        },
        '.text-gradient-gold': {
          backgroundImage: 'linear-gradient(135deg, #d4a824 0%, #f6c843 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent'
        },
        '.text-gradient-light': {
          backgroundImage:
            'linear-gradient(135deg, #e8dfd1 0%, #f5f1e8 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent'
        }
      });
    }
  ]
};