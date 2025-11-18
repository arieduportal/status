import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      edge: false,
      routes: {
        includes: ['/*'],
        exclude: ['<build>']
      }
    }),
    alias: {
      $components: "src/components",
      $lib: "src/lib",
    },
  },
};

export default config;
