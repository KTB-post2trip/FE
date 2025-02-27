import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     // 프론트엔드에서 /api로 요청하면, 실제로는 http://13.124.106.170:8080/api로 요청
  //     '/api': {
  //       target: 'http://13.124.106.170:8080',
  //       changeOrigin: true,
  //       // rewrite: (path) => path.replace(/^\/api/, '/api'),
  //     },
  //   },
  // },
});
