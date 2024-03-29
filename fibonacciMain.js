var fibonacci = function (n) {
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return fibonacci(n-1) + fibonacci(n-2);
};
// 一个模块是否直接被调用
if (require.main === module) {
  // 如果是直接执行 main.js，则进入此处
  // 如果 main.js 被其他文件 require，则此处不会执行。
  //process.argv命令行参数
  console.log(process.argv)
  var n = Number(process.argv[2]);
  console.log('fibonacci(' + n + ') is', fibonacci(n));
}
exports.fibonacci = fibonacci;
