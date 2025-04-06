/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // JSX/TSXファイルがある場合
    "./public/index.html", // HTMLファイルも含める場合
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
