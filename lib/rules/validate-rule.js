const stylelint = require('stylelint');
const ruleName = 'nanachi/validate-rule';
const parser = require('postcss-selector-parser');

const invalidatePseudos = ['after', 'before', 'hover', 'first-child','active', 'last-child'];

function findInvalidateRule(css, { invalidatePseudos }, rule, result) {
    const selectorReg = /^tag|class|id$/;
    let find = false;
    parser((selector) => {
        // 遍历选择器
        for (var i = 0, length = selector.nodes && selector.nodes.length; i < length; i++) {
            find = selector.nodes[i].nodes.some(node => {
                if (node.type === 'pseudo' && node.value.match(new RegExp(invalidatePseudos.join('|')))) {
                    stylelint.utils.report({
                        message: `快应用不支持${invalidatePseudos.join('、')}伪类选择器`,
                        ruleName,
                        result,
                        node: rule
                    });
                    return true;
                }
                if (selectorReg.test(node.type)) {
                    const next = node.next();
                    if (next && selectorReg.test(next.type)) {
                        stylelint.utils.report({
                            message: `快应用不支持${selector.toString()}选择器`,
                            ruleName,
                            result,
                            node: rule
                        });
                        return true;
                    }
                }
                return false;
            });
            // 如果找到非法属性，停止查找
            if (find) {
                return;
            }
        }
    }).processSync(css, {
        lossless: false
    });
    return find;
}

module.exports = stylelint.createPlugin(ruleName, function(pri, sec) {
    return function(root, result) {
        root.walkRules(rule => {
            findInvalidateRule(rule.selector, { invalidatePseudos }, rule, result);
        });
    }
});
module.exports.ruleName = ruleName;
