/** @type {import('tailwindcss').Config} */

// Define your color palette
// NB: These are just demo colors to get you started, change the color hex codes to your preferred color hex codes
const colors = {
  light: {
    background: '#F8F9FA',
    foreground: '#020203',
    card: '#FFFFFF',
    cardForeground: '#000608',
    popover: '#F0F9FC',
    popoverForeground: '#000608',
    primary: '#2FC4FE',
    primaryForeground: '#000B0F',
    secondary: '#1FA9F9',
    secondaryForeground: '#034063',
    muted: '#D5DDE0',
    mutedForeground: '#5F7780',
    accent: '#3A58EC',
    accentForeground: '#A2B0F6',
    destructive: '#FF382B',
    destructiveForeground: '#FFFFFF',
    border: '#E9F1F3',
    input: '#CCDDE3',
    ring: '#E9F1F3',
  },
  dark: {
    background: '#000101',
    foreground: '#FAFEFF',
    card: '#13262D',
    cardForeground: '#FAFEFF',
    popover: '#282F32',
    popoverForeground: '#FAFEFF',
    primary: '#2FC4FE',
    primaryForeground: '#000000',
    secondary: '#1FA9F9',
    secondaryForeground: '#034063',
    muted: '#596A71',
    mutedForeground: '#C5CED1',
    accent: '#112AA5',
    accentForeground: '#A2B0F6',
    destructive: '#FE4336',
    destructiveForeground: '#FFFFFF',
    border: '#3A4549',
    input: '#455257',
    ring: '#3A4549',
  },
}

module.exports = {
  darkMode: 'class',
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: colors.light.background,
        foreground: colors.light.foreground,
        card: {
          DEFAULT: colors.light.card,
          foreground: colors.light.cardForeground,
        },
        popover: {
          DEFAULT: colors.light.popover,
          foreground: colors.light.popoverForeground,
        },
        primary: {
          DEFAULT: colors.light.primary,
          foreground: colors.light.primaryForeground,
        },
        secondary: {
          DEFAULT: colors.light.secondary,
          foreground: colors.light.secondaryForeground,
        },
        muted: {
          DEFAULT: colors.light.muted,
          foreground: colors.light.mutedForeground,
        },
        accent: {
          DEFAULT: colors.light.accent,
          foreground: colors.light.accentForeground,
        },
        destructive: {
          DEFAULT: colors.light.destructive,
          foreground: colors.light.destructiveForeground,
        },
        border: colors.light.border,
        input: colors.light.input,
        ring: colors.light.ring,
      },
    },
  },
  plugins: [
    // This plugin automatically generates dark: variants with your dark theme colors
    function ({ addUtilities }) {
      const darkUtilities = {
        '.dark .bg-background': { backgroundColor: colors.dark.background },
        '.dark .bg-foreground': { backgroundColor: colors.dark.foreground },
        '.dark .bg-card': { backgroundColor: colors.dark.card },
        '.dark .bg-card-foreground': {
          backgroundColor: colors.dark.cardForeground,
        },
        '.dark .bg-popover': { backgroundColor: colors.dark.popover },
        '.dark .bg-popover-foreground': {
          backgroundColor: colors.dark.popoverForeground,
        },
        '.dark .bg-primary': { backgroundColor: colors.dark.primary },
        '.dark .bg-primary-foreground': {
          backgroundColor: colors.dark.primaryForeground,
        },
        '.dark .bg-secondary': { backgroundColor: colors.dark.secondary },
        '.dark .bg-secondary-foreground': {
          backgroundColor: colors.dark.secondaryForeground,
        },
        '.dark .bg-muted': { backgroundColor: colors.dark.muted },
        '.dark .bg-muted-foreground': {
          backgroundColor: colors.dark.mutedForeground,
        },
        '.dark .bg-accent': { backgroundColor: colors.dark.accent },
        '.dark .bg-accent-foreground': {
          backgroundColor: colors.dark.accentForeground,
        },
        '.dark .bg-destructive': { backgroundColor: colors.dark.destructive },
        '.dark .bg-destructive-foreground': {
          backgroundColor: colors.dark.destructiveForeground,
        },
        '.dark .bg-border': { backgroundColor: colors.dark.border },
        '.dark .bg-input': { backgroundColor: colors.dark.input },

        '.dark .text-background': { color: colors.dark.background },
        '.dark .text-foreground': { color: colors.dark.foreground },
        '.dark .text-card': { color: colors.dark.card },
        '.dark .text-card-foreground': { color: colors.dark.cardForeground },
        '.dark .text-popover': { color: colors.dark.popover },
        '.dark .text-popover-foreground': {
          color: colors.dark.popoverForeground,
        },
        '.dark .text-primary': { color: colors.dark.primary },
        '.dark .text-primary-foreground': {
          color: colors.dark.primaryForeground,
        },
        '.dark .text-secondary': { color: colors.dark.secondary },
        '.dark .text-secondary-foreground': {
          color: colors.dark.secondaryForeground,
        },
        '.dark .text-muted': { color: colors.dark.muted },
        '.dark .text-muted-foreground': { color: colors.dark.mutedForeground },
        '.dark .text-accent': { color: colors.dark.accent },
        '.dark .text-accent-foreground': {
          color: colors.dark.accentForeground,
        },
        '.dark .text-destructive': { color: colors.dark.destructive },
        '.dark .text-destructive-foreground': {
          color: colors.dark.destructiveForeground,
        },

        '.dark .border-background': { borderColor: colors.dark.background },
        '.dark .border-foreground': { borderColor: colors.dark.foreground },
        '.dark .border-border': { borderColor: colors.dark.border },
        '.dark .border-input': { borderColor: colors.dark.input },
        '.dark .border-ring': { borderColor: colors.dark.ring },
        '.dark .border-card': { borderColor: colors.dark.card },
        '.dark .border-primary': { borderColor: colors.dark.primary },
        '.dark .border-secondary': { borderColor: colors.dark.secondary },
        '.dark .border-muted': { borderColor: colors.dark.muted },
        '.dark .border-accent': { borderColor: colors.dark.accent },
        '.dark .border-destructive': { borderColor: colors.dark.destructive },
      }

      addUtilities(darkUtilities)
    },
  ],
}
