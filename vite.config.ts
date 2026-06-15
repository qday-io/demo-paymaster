import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
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
