const stylelint = require('stylelint');
const ruleName = 'nanachi/validate-declaration';

function splitBorder(decl, result) {
    if (decl.value === 'none') {
        stylelint.utils.report({
            message: '快应用不支持border: none',
            ruleName,
            result,
            node: decl
        });
    }
    let values = decl.value.replace(/(,\s+)/g, ',').trim().split(/\s+/);
    if (values) {
        if (values.length > 3) {
            stylelint.utils.report({
                message: `${decl.prop} 参数个数错误, ${values}, 只保留前三个参数 ${values.slice(0, 3)})`,
                ruleName,
                result,
                node: decl
            });
        }
    }
}

function transformBorderRadius(decl, result) {
    const values = decl.value.replace(/(,\s+)/g, ',').trim().split(/\s+/);
    if (values.length > 4) {
        stylelint.utils.report({
            message: `${decl.prop} 参数个数错误, ${values}`,
            ruleName,
            result,
            node: decl
        });
        return;
    }
}

function generateConflictDeclarations(declName, conflictRegex) {
    return (decl, result) => {
        const parent = decl.parent;
        parent.each((node) => {
            if (conflictRegex.test(node.prop)) {
                stylelint.utils.report({
                    message: `已设置${declName}, 编译后${node.prop}将被移除`,
                    ruleName,
                    result,
                    node: decl
                });
            }
        });
    };
}

const visitors = {
    'border-style'(decl, result) {
        const match = decl.value.match(/[a-z]+/gi);
        if (match && match.length > 1) {
            stylelint.utils.report({
                message: 'border-style只能有一个值，编译后只保留第一个',
                ruleName,
                result,
                node: decl
            });
        }
    },
    'border'(decl, result) {
        if (decl.value === 'none') {
            stylelint.utils.report({
                message: '快应用不支持border: none',
                ruleName,
                result,
                node: decl
            });
        }

    },
    'border-radius'(decl, result) {
        generateConflictDeclarations(
            'border-radius',
            /border-(left|bottom|right|top)-(color|width)/i
        )(decl, result);
        transformBorderRadius(decl, result);
    },
    'background': (decl, result) => {
        generateConflictDeclarations(
            'background',
            /(background|border)-color/i
        )(decl, result);
    },
    'background-image'(decl, result) {
        generateConflictDeclarations(
            'background-image',
            /(background|border)-color/i
        )(decl, result);
    },
    margin(decl, result) {
        if (decl.value.indexOf('auto') !== -1) {
            stylelint.utils.report({
                message: '在快应用中无法在 margin 中使用 auto 居中，请使用 flex 布局。',
                ruleName,
                result,
                node: decl
            });
        }
    },
    'border-left': splitBorder,
    'border-right': splitBorder,
    'border-bottom': splitBorder,
    'border-top': splitBorder,
    'animation': (declaration, result) => {
        generateConflictDeclarations(
            'animation',
            /animation-(name|duration|timing-function|delay|iteration-count|direction)/i
        )(declaration, result);
    }
};

module.exports = stylelint.createPlugin(ruleName, function(pri, sec) {
    return function(root, result) {
        root.walkDecls((decl) => {
            if (visitors[decl.prop]) {
                visitors[decl.prop](decl, result);
            }
        })
    }
});
module.exports.ruleName = ruleName;
