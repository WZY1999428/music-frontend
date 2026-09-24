// @ts-check
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';
import { pluginSass } from '@rsbuild/plugin-sass';
const AutoImport = require("unplugin-auto-import/rspack").default;

const env = import.meta.env;


const backendProxy = {
  target: env.BASE_URL,
  changeOrigin: true,
};

export default () => {
  return {
    plugins: [pluginVue(), pluginTailwindcss(), pluginSass()],

    resolve: {
      alias: {
        '@': './src',
      },
    },
    
    dev: {
      writeToDisk: true,
    },

    tools: {
      rspack: {
        plugins: [AutoImport({
          imports: ["vue", "vue-router"],
          dirs: ["./src/utils"],
          vueTemplate: true,
        })],
      },
    },

    server: {
      port: env.SERVER_PORT || 3000,
      host: true,
      proxy: {
        '/admin-api': backendProxy,
        '/avatar': backendProxy,
        '/uploads': backendProxy,
        '/cover': backendProxy,
      },
    },
  }
};


