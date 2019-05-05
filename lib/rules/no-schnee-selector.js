const stylelint = require('stylelint');
const parser = require('postcss-selector-parser');
const CONSTS = require('../consts');

const ruleName = 'nanachi/no-schnee-selector';

function parseSelector(css) {
    let result = [];
    parser((selector) => {
        if (selector.nodes && selector.nodes.length) {
            // 遍历选择器
            for (var i = 0, length = selector.nodes.length; i < length; i++) {
                result = result.concat(selector.nodes[i].toString().split(/\s+/));
            }
        }
    }).processSync(css, {
        lossless: false
    });
    return result;
}

module.exports = stylelint.createPlugin(ruleName, function(pri, sec) {
    return function(root, result) {
        const patchComponents = CONSTS[sec] && CONSTS[sec].patchComponents || [];
        root.walkRules(rule => {
            const selectors = parseSelector(rule.selector);
            patchComponents.forEach(comp => {
                if (selectors.indexOf(comp) !== -1) {
                    stylelint.utils.report({
                        message: `补丁组件${comp}不支持标签选择器`,
                        ruleName,
                        result,
                        node: rule
                    });
                }
            });

        });
    }
});
module.exports.ruleName = ruleName;
