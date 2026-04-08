export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  daisyui: {
  themes: [
    {
      light: {
        ...require("daisyui/src/theming/themes")["light"],
        primary: "#2563eb",
        secondary: "#7c3aed",
        accent: "#22d3ee",
        neutral: "#0f172a",
        "base-100": "#f8fafc",
      },
    },
    {
      dark: {
        ...require("daisyui/src/theming/themes")["dark"],
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#22d3ee",
        neutral: "#0a0f1f",
        "base-100": "#0f172a",
      },
    },
  ],
},
  plugins: [require("daisyui")],
};
