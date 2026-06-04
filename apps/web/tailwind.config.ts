import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        border: 'var(--border)',
        border2: 'var(--border2)',
        'signal-candidate': 'var(--signal-candidate)',
        'signal-admitted': 'var(--signal-admitted)',
        'signal-retained': 'var(--signal-retained)',
        'signal-assessed': 'var(--signal-assessed)',
        'signal-resolved': 'var(--signal-resolved)',
        'signal-archived': 'var(--signal-archived)',
        'signal-expired': 'var(--signal-expired)',
        'hypothesis-active': 'var(--hypothesis-active)',
        'hypothesis-confirmed': 'var(--hypothesis-confirmed)',
        'hypothesis-falsified': 'var(--hypothesis-falsified)',
        'lp-flag': 'var(--lp-flag)',
        accent: 'var(--accent)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
        red: 'var(--red)',
        'red-dim': 'var(--red-dim)',
        green: 'var(--green)',
        'green-dim': 'var(--green-dim)',
        blue: 'var(--blue)',
        flag: 'var(--flag)',
        'flag-bg': 'var(--flag-bg)',
      },
      fontFamily: {
        mono: ['"DM Mono"', 'monospace'],
        serif: ['"Instrument Serif"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
