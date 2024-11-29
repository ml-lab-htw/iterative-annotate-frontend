import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /bg-(white|black|blue|lightBlue|pink|lightPink|orange|lightOrange|gray|lightGray)/,
      variants: ['hover', 'group-hover', 'active']
    },
    {
      pattern: /border-(white|black|blue|lightBlue|pink|lightPink|orange|lightOrange|gray|lightGray)/,
      variants: ['hover', 'group-hover', 'active']
    },
    {
      pattern: /text-(white|black|blue|lightBlue|pink|lightPink|orange|lightOrange|gray|lightGray)/,
      variants: ['hover', 'group-hover', 'active']
    },
  ],
  theme: {
    colors: {
      white: '#FFFFFF',
      black: '#000000',

      blue: '#0079D1',
      lightBlue: '#6D9EC2',

      pink: '#EC4BB5',
      lightPink: '#C26DA5',

      orange: '#FF773D',
      lightOrange: '#E0A085',

      gray: '#AAAAAA',
      lightGray: '#e9e9e9',
    },
    extend: {
      fontFamily: {
      },
      fontSize: {
        // Default sizes optimized for 340px width
        'h1': '26px',
        'h2': '22px',
        'h3': '14px',
        'body': '14px',
        'body-small': '10px',

        // MD: > 768px
        'h1-md': '28px',
        'h2-md': '22px',
        'h3-md': '16px',
        'body-md': '16px',
        'body-small-md': '12px',

        // XL: > 1280px Desktop
        'h1-xl': '30px',
        'h2-xl': '24px',
        'h3-xl': '18px',
        'body-xl': '22px',
        'body-small-xl': '14px',
      },
    },
  },
  plugins: [],
};
export default config;
