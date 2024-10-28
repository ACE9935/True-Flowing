import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
     extend:{
      colors:{
        "primary-color":'var(--primary-color)',
        "secondary-color": 'var(--secondary-color)',
        "primary-blue":'var(--primary-blue)',
        "primary-blue-light":'var(--primary-blue-light)',
        "primary-blue-extra-light":'var(--primary-blue-extra-light)',
        "primary-blue-dark":'var(--primary-blue-dark)',
        "title-secondary": 'var(--title-secondary)',
        "content-secondary": 'var(--content-secondary)',

      },
      backgroundImage:{
        "form":"radial-gradient(circle at 100% 100%, var(--primary-blue) 10%,var(--primary-color) 50%)"
      }
    }
  },
  plugins: [],
};
export default config;
