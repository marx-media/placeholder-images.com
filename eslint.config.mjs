// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    vue: true,
    typescript: true,
    markdown: true,
    stylistic: false,
    toml: false,
    rules: {
      'node/prefer-global/process': 'off',
      'antfu/top-level-function': 'off',
      'no-console': 'off',
      'vue/multi-word-component-names': 0,
      'vue/max-attributes-per-line': 'off',
      'vue/no-v-html': 0,
      'vue/html-self-closing': ['error', {
        html: {
          void: 'any',
          normal: 'any',
          component: 'any'
        },
        svg: 'always',
        math: 'always'
      }],
      '@stylistic/spaced-comment': 'off'
    }
  })
  // ...your other rules
)
