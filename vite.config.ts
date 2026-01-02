import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      insertTypesEntry: true,
      rollupTypes: true,
      include: ["src/lib"],
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "react-storage-observable-hook",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
