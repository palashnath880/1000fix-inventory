import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // exclude: ["@react-pdf/renderer"], // Ensure Vite doesn't pre-bundle the package
  },
});
