// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://43.204.9.219:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};

