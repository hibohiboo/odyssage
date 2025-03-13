import uiPreset from '../../packages/ui/tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // UIパッケージのコンポーネントも含める
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  // UIパッケージのテーマを継承
  presets: [uiPreset],
};