import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: "/lever-science-lab/",
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: command === "serve" ? {
        plugins: [
          'react-dev-locator',
        ],
      } : undefined,
    }),
    tsconfigPaths()
  ],
}))
