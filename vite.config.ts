import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr({ svgrOptions: { icon: true } }), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
