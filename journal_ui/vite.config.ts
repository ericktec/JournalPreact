import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		cors: true,
		headers: 'Origin, Content-Type, X-Auth-Token, Set-Cookie, Authorization, Accept',
		origin: "https://localhost:3000",
		https: {
			key: "./credentials/cert-key.pem",
			cert: "./credentials/cert.pem" 
		}
	},
	plugins: [preact()],
});
