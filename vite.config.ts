import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const epRoot = resolve(__dirname, '.'),
  epOutput = resolve(epRoot, 'dist');

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: ['./index.ts'],
      external: ['node-zookeeper-client'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          preserveModulesRoot: epRoot,
          exports: 'named',
          dir: resolve(epOutput, `es`)
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: epRoot,
          exports: 'named',
          dir: resolve(epOutput, `lib`)
        }
      ]
    },
    lib: {
      entry: './index.ts',
      name: 'nodeZookeeperClientAsync'
    }
  },
  plugins: [
    dts({
      entryRoot: epRoot,
      outDir: [
        resolve(epOutput, 'es'),
        resolve(epOutput, 'lib')
      ],
      tsconfigPath: './tsconfig.json',
    })
  ]
}) as any;