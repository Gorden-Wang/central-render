module.exports = {
    parser: 'vue-eslint-parser', // 解析 .vue 文件
    extends: [
      'plugin:vue/recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    plugins: ['@typescript-eslint','eslint-plugin-import'],
    parserOptions: {
      parser: '@typescript-eslint/parser' // 解析 .ts 文件
    },
    rules: {
      "camelcase": "off",
      "vue/no-v-html": "off",
      "vue/html-self-closing": "off",
      "vue/space-infix-ops": "error",
      "vue/mustache-interpolation-spacing": "error",
      "vue/singleline-html-element-content-newline": "off",
      "@typescript-eslint/type-annotation-spacing": "error",
      "import/newline-after-import": "error",
      "space-before-function-paren": [
        "error",
        { "anonymous": "always", "named": "never", "asyncArrow": "always" }
      ]
    }
}