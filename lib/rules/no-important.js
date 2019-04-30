const stylelint = require('stylelint');
const ruleName = 'nanachi/no-important';

module.exports = stylelint.createPlugin(ruleName, function(pri, sec) {
    return function(root, result) {
        root.walkDecls((decl) => {
            if (decl.important) {
                stylelint.utils.report({
                    message: '快应用不支持important',
                    ruleName,
                    result,
                    node: decl
                });
            }
        })
    }
});
module.exports.ruleName = ruleName;
