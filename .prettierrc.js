module.exports = {
  printWidth: 100, // 超过最大值换行
  semi: false, // 句尾添加分号
  singleQuote: true, // 使用单引号代替双引号
  endOfLine: 'crlf', // 结尾是 \n \r \n\r auto
  jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
  parser: 'babel', // 格式化的解析器，默认是babylon
  trailingComma: 'none' // 在对象或数组最后一个元素后面是否加逗号
}