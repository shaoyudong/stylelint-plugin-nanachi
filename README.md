nanachi stylelint插件，结合vscode使用，智能提示错误样式语法

![no-important](https://user-images.githubusercontent.com/16398401/56953647-9c570000-6b6f-11e9-9088-b93b5924b25c.png)

## usage
``` bash
npm install stylelint stylelint-plugin-nanachi --save-dev
```
## 配置文件
``` json
// .stylelintrc
{
    "extends": [
        "stylelint-plugin-nanachi/config/quick.json" // platform包括wx、tt、qq、ali、bu、quick
    ]
}
```
## vscode设置
安装stylelint插件