import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import tsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths(), reactRefresh()],
  build: { sourcemap: true, minify: false },
});
