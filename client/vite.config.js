import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-react-components/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    AutoImport({
      imports: ["react"],
    }),
    Components({
      dirs: ["src/components"], // scan this folder for components
      extensions: ["jsx", "tsx"],
      deep: true, // search subfolders too
      dts: true, // generate `components.d.ts` global declarations
})
  ],
});
