/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          muted: 'var(--bg-muted)',
          border: 'var(--border-color)',
          'border-subtle': 'var(--border-subtle)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          subtle: 'var(--text-muted)',
          accent: 'var(--accent-primary)',
          'accent-hover': 'var(--accent-hover)',
          'accent-light': 'var(--accent-light)',
          ring: 'var(--accent-ring)',
        }
      },
      boxShadow: {
        'cute': '0 4px 20px -2px var(--shadow-color)',
        'cute-lg': '0 10px 30px -4px var(--shadow-color)',
        'glow': '0 0 25px -3px var(--accent-light)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2.5s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
