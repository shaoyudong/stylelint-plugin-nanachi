const stylelint = require('stylelint');
const ruleName = 'nanachi/validate-style-path';
const path = require('path');

module.exports = stylelint.createPlugin(ruleName, function(pri, sec) {
    return function(root, result) {
        const resourcePath = result.opts.from;
        
        if (/[\\/]source[\\/]pages/.test(resourcePath) && !/^index\./.test(path.basename(resourcePath))) {
            stylelint.utils.report({
                message: 'pages目录下样式名必须为index',
                ruleName,
                result,
                node: root
            });
        }
    }
});
module.exports.ruleName = ruleName;
