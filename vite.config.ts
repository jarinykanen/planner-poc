import { defineConfig } from 'vite'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(
  {
    plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact()],
    resolve: {
      alias: {
        api: "/src/api",
        app: "/src/app",
        assets: "/src/assets",
        atoms: "/src/atoms",
        components: "/src/components",
        generated: "/src/generated",
        hooks: "/src/hooks",
        routes: "/src/routes",
        src: "/src",
        theme: "/src/theme",
        types: "/src/types",
        utils: "/src/utils",
      },
    },
    // Deploy to a GitHub Pages
    base: "/planner-poc/"
  }
);