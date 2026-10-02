import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwind from "@tailwindcss/vite";
import seo from "./vite/seo";

export default defineConfig({
  plugins: [solid(), tailwind(), seo()],
});
