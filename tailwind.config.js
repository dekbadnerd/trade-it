/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        app: '#F7F7F7',
        surface: '#FFFFFF',
        raised: '#F7F7F7',
        line: '#DDD7D2',
        ink: '#000000',
        muted: '#5F5550',
        cocoa: '#854836',
        gold: '#FFB22C',
        'gold-soft': '#FFC769',
        void: '#000000',
        panel: '#FFFFFF',
        ivory: '#000000',
        ash: '#5F5550',
        danger: '#B42318',
        epic: '#7C3AED',
        legendary: '#B7791F',
        mythic: '#C2410C',
      },
      boxShadow: {
        premium: '0 12px 28px rgba(0, 0, 0, 0.08)',
        rarity: '0 1px 0 rgba(255,255,255,0.9) inset, 0 14px 24px rgba(133,72,54,0.12)',
      },
    },
  },
  plugins: [],
}
