import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: './dist',
        rollupOptions: {
            output: {
                assetFileNames: () => {
                    return '[name][extname]';
                },
                chunkFileNames: '[name].js',
                entryFileNames: '[name].js'
            }
        }
    }
});
