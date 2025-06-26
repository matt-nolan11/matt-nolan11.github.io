/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        business: {
          ...require('daisyui/src/theming/themes')['business'],
        },
      },
      {
        corporate: {
          ...require('daisyui/src/theming/themes')['corporate'],
        },
      },
    ],
    darkTheme: 'business',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: false,
    themeRoot: ':root',
  },
}
