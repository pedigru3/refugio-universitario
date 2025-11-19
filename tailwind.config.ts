import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'plus-jakarta-sans': 'var(--font-plus-jakarta-sans)',
      },
      colors: {
        'gradient-start': '#1101A2',
        'gradient-middle': '#7705F7',
        'gradient-end': '#B40EFF',
        'purple-dark': '#4C0C7F',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        calendar: '1fr 280px',
      },
    },
  },
  plugins: [
    function ({ addVariant }: { addVariant: any }) {
      addVariant('child', '& > *')
      addVariant('child-hover', '& > *:hover')
    },
  ],
}
export default config
