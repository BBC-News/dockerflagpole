/**
 * Object to hold a Gousto recipe
 */
"use strict";

var RouterUtils = function() {};

RouterUtils.getErrorMsg = function(_msg) {
  return this.getHead()+'<body><div>'+_msg+'</div></body>'
}

RouterUtils.getHead = function() {
  let headOutput = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Title</title>\n' +
    '</head>\n';
  return headOutput
};
RouterUtils.showAll = function(_flagpoles) {
  let resultStart = this.getHead()+'<body>\n    <ol>',
    resultBody = '',
    resultEnd = '   </ol>\n</body>\n</html>';

  if (Array.isArray(_flagpoles)) {
    for (var i = 0; i < _flagpoles.length; i++) {
      resultBody += '<li>' + _flagpoles[i].name + ' : ' + _flagpoles[i].textValue() + '</li>';
    }
  }
  return resultStart+resultBody+resultEnd;
};

module.exports = RouterUtils;