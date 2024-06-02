import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/FinManage/",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "pages/*",
          dest: "pages",
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
  },
});
