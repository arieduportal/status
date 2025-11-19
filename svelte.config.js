import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      edge: false,
    }),
    alias: {
      $components: "src/components",
      $lib: "src/lib",
    },
  },
};

export default config;
