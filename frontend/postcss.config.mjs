// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {}, // <--- Just the name as the key, empty object as value
    autoprefixer: {}, // <--- Just the name as the key, empty object as value
    // Do NOT add other things like require('tailwindcss') here
  },
}