/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        void: 'oklch(15% 0.018 74)',
        panel: 'oklch(20% 0.022 74)',
        raised: 'oklch(27% 0.026 74)',
        line: 'oklch(40% 0.035 74)',
        gold: 'oklch(82% 0.15 82)',
        'gold-soft': 'oklch(91% 0.09 86)',
        ivory: 'oklch(97% 0.004 86)',
        ash: 'oklch(82% 0.012 82)',
        danger: 'oklch(67% 0.18 25)',
        epic: 'oklch(69% 0.17 306)',
        legendary: 'oklch(78% 0.16 64)',
        mythic: 'oklch(70% 0.19 28)',
      },
      boxShadow: {
        premium: '0 6px 8px rgba(0, 0, 0, 0.24)',
        rarity: '0 0 0 1px rgba(255,255,255,0.04), 0 10px 18px rgba(0,0,0,0.26)',
      },
    },
  },
  plugins: [],
}
