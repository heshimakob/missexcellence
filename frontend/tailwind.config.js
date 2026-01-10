/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070711",
          900: "#0B0B18",
          800: "#12122A",
        },
        neon: {
          400: "#7CFFCB",
          500: "#45F6B9",
        },
        orchid: {
          400: "#C09BFF",
          500: "#9D6CFF",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.08), 0 18px 40px rgba(0,0,0,.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        shimmer: "shimmer 12s ease infinite",
      },
    },
  },
  plugins: [],
};


