const theme = require("./src/config/theme.json");

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;
let fontPrimary, fontPrimaryType, fontSecondary, fontSecondaryType;
if (theme.fonts.font_family.primary) {
  fontPrimary = theme.fonts.font_family.primary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontPrimaryType = theme.fonts.font_family.primary_type;
}
if (theme.fonts.font_family.secondary) {
  fontSecondary = theme.fonts.font_family.secondary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontSecondaryType = theme.fonts.font_family.secondary_type;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  safelist: [],
  darkMode: "class",
  theme: {
    screens: {
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        text: theme.colors.default.text_color.default,
        light: theme.colors.default.text_color.light,
        dark: theme.colors.default.text_color.dark,
        // `primary` clears WCAG AA both as text on white and as a button fill
        // behind white text; `primary-bright` is the original brand teal, kept
        // for decorative fills where contrast rules don't apply.
        primary: theme.colors.default.theme_color.primary,
        "primary-bright": theme.colors.default.theme_color.primary_bright,
        secondary: theme.colors.default.theme_color.secondary,
        accent: theme.colors.default.theme_color.accent,
        body: theme.colors.default.theme_color.body,
        border: theme.colors.default.theme_color.border,
        "theme-light": theme.colors.default.theme_color.theme_light,

        // dark mode palette — the markup references these via `dark:` variants
        "darkmode-text": theme.colors.darkmode.text_color.default,
        "darkmode-dark": theme.colors.darkmode.text_color.dark,
        "darkmode-primary": theme.colors.darkmode.theme_color.primary,
        "darkmode-secondary": theme.colors.darkmode.theme_color.secondary,
        "darkmode-accent": theme.colors.darkmode.theme_color.accent,
        "darkmode-body": theme.colors.darkmode.theme_color.body,
        "darkmode-border": theme.colors.darkmode.theme_color.border,
        "darkmode-theme-light": theme.colors.darkmode.theme_color.theme_light,
        "theme-dark": theme.colors.darkmode.theme_color.theme_dark,
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(16,28,40,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,28,40,.05) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(47,212,201,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,212,201,.07) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-18px) scale(1.04)" },
        },
      },
      animation: {
        "float-slow": "float-slow 14s ease-in-out infinite",
      },
      fontSize: {
        base: font_base + "px",
        h1: h1 + "rem",
        "h1-sm": h1 * 0.8 + "rem",
        h2: h2 + "rem",
        "h2-sm": h2 * 0.8 + "rem",
        h3: h3 + "rem",
        "h3-sm": h3 * 0.8 + "rem",
        h4: h4 + "rem",
        h5: h5 + "rem",
        h6: h6 + "rem",
      },
      fontFamily: {
        primary: [fontPrimary, fontPrimaryType],
        secondary: [fontSecondary, fontSecondaryType],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({ generateContainer: false }),
  ],
};
