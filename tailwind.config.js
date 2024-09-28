/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#031C30",
      },
      fontFamily: `"Nunito Sans", sans-serif`,
    },
  },
  plugins: [],
};
