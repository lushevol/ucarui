# UI Toolkit for UCarInc DevOps based on element-ui

## 启动本地测试环境

```
npm run dev
```

## 启动本地自动单元测试环境

```
npm run test
```

## 新增组件需要进行以下步骤:

1. 在`packages`目录下创建自己的组件
2. 在`packages\theme-chalk\src\`目录下增加组件scss，并在同级`index.scss`中引用。必要时可以在`packages\theme-chalk\src\common\var.scss`中增加自定义变量。
3. 在`components.json`中加入新组件，编译需要。必要时在`build\bin\build-entry.js`中对组件进一步处理。

## 新增组件测试需要进行以下步骤：

1. `examples\nav.config.json`中增加新组件导航
2. `examples\docs\zh-CN\`中增加新组件的展示文档文件
3. `test\unit\specs\`中增加新组件的单元测试文档文件