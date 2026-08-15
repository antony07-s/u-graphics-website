/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Centralized brand tokens — swap these when real branding is ready
        primary: {
          DEFAULT: "#0B3D91", // corporate blue
          light: "#1E56B0",
          dark: "#082C6B",
        },
        accent: {
          DEFAULT: "#FF6B00", // energetic orange
          light: "#FF8A33",
          dark: "#CC5500",
        },
        ink: "#1A1A1A",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F5F6F8",
        },
        success: "#2E7D32",
        danger: "#D32F2F",
      },
      fontFamily: {
        heading: ["Arial", "Helvetica", "sans-serif"],
        body: ["Arial", "Helvetica", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(11, 61, 145, 0.08)",
        cardHover: "0 8px 30px rgba(11, 61, 145, 0.15)",
      },
    },
  },
  plugins: [],
};
