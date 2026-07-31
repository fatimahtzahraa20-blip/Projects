import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/', // ensure correct base when deploying to root domain; change to '/subpath/' if deployed to a subpath

  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },

  // Added conservative build options to improve production build stability
  build: {
    target: "es2022",
    sourcemap: false,
    minify: "esbuild",
    // Allow transforming mixed ESM/CJS modules which fixes many build-time
    // errors when third-party packages ship CommonJS in node_modules.
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
