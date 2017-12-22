var fibonacciMain = require('./fibonacciMain');
var should = require('should');
//describe 中的字符串，用来描述你要测的主体是什么；
//it 当中，描述具体的 测试 内容。
// should 模块，是个断言库.比如测试一个数是不是大于3，则是 (5).should.above(3)；测试一个字符串是否有着特定前缀：'foobar'.should.startWith('foo');
// expect.js 也是一个断言库
describe('test.js', function () {
  it('should equal 55 when n === 10', function () {
    fibonacciMain.fibonacci(10).should.equal(55);
  });
  // it('should throw when n>10',function(){
  //   (function(){
  //     fibonacciMain.fibonacci(11);
  //   }).should.throw('n should <= 10')
  // })
});
