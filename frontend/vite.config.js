import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tailwindcss()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "http://localhost:5000",
			},
		},
	},
});
