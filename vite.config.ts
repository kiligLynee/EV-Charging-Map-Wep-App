import { defineConfig } from "vite";
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react({})],
	css: {
		postcss: {
			plugins: [tailwindcss(), autoprefixer()],
		},
	},
	server: {
		proxy: {
			"/api": {
				// target: "http://localhost:15000",
				target: "http://18.222.115.43:15000",
				changeOrigin: true,
				secure: false,
				cookieDomainRewrite: "18.222.115.43",
				// rewrite: (path) => path.replace(/^\/api/, '/api/') // 不可以省略rewrite
				rewrite: (path) => path.replace(/^\/api/, "/"), // 不可以省略rewrite
			},
		},
	},
});
