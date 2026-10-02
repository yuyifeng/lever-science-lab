import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: "/lever-science-lab/",
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    legacy({
      targets: ["Chrome >= 64", "Android >= 7"],
      modernPolyfills: ["es.object.from-entries"],
    }),
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
