module.exports = {
  // ...
  plugins: ['prettier'], // Burada 'prettier' eklendi
  // parser: 'babel-eslint',
  rules: {
    'react-hooks/exhaustive-deps': 'off', // veya 'error' olarak ayarlayabilirsiniz
    // Diğer kurallar...
  },
  // ...
};
