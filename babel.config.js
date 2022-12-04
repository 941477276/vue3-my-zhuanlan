module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    '@vue/babel-plugin-jsx',
    ["prismjs", {
      "languages": ["javascript", "css", "markup"],
      "plugins": ["line-numbers"],
      "theme": "coy",
      "css": true
    }]
  ]
};
