import path from "node:path"
import react from "@vitejs/plugin-react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/bundler": {
        target: "http://localhost:4337",
        rewrite: (path) => path.replace(/^\/bundler/, ""),
        changeOrigin: true,
      },
    },
  },
})
