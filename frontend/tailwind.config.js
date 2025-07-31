/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-purple": {
          "gradient-start": "#3B82F6",
          "gradient-end": "#8B5CF6",
        },
      },
      backgroundImage: {
        "blue-purple-gradient":
          "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
      },
    },
  },
  plugins: [],
};
