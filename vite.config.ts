import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Tostado',
      fileName: 'tostado',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['lit', /^lit\//],
      output: {
        globals: {
          lit: 'Lit',
          'lit/decorators.js': 'LitDecorators',
          'lit/directives/repeat.js': 'LitRepeat',
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
