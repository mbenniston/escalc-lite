import * as path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      ncalcjs: path.resolve(
        import.meta.dirname,
        'node_modules/ncalcjs/dist/ncalc.web.js',
      ),
    },
  },
})
