const stylelint = require('stylelint');
const ruleName = 'nanachi/no-id-selector';
const parser = require('postcss-selector-parser');

module.exports = stylelint.createPlugin(ruleName, function(pri, sec) {
    return function(root, result) {
        root.walkRules((rule) => {
            let find = false;
            parser((selector) => {
                selector.walkIds((id) => {
                    find = true;
                });
            }).processSync(rule.selector, {
                lossless: false
            });
            if (find) {
                stylelint.utils.report({
                    message: '不支持id选择器',
                    ruleName,
                    result,
                    node: rule
                });
            }
        })
    }
});
module.exports.ruleName = ruleName;
