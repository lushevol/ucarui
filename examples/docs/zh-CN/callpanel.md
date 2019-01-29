<script>
  module.exports = {
    methods: {
      open() {
        const h = this.$createElement;

        this.$callpanel({
          call: {
            type: 'audio'
          }
        });
      },

      open2() {
        this.$callpanel({
          call: {
            type: 'video'
            }
          });
      },

      onClose() {
        console.log('Notification 已关闭');
      }
    }
  };
</script>

## Callpanel 通话面板



### 基本用法

适用性广泛的通知栏

:::demo Notification 组件提供通知功能，Element 注册了`$notify`方法，接收一个`options`字面量参数，在最简单的情况下，你可以设置`title`字段和`message`字段，用于设置通知的标题和正文。默认情况下，经过一段时间后 Notification 组件会自动关闭，但是通过设置`duration`，可以控制关闭的时间间隔，特别的是，如果设置为`0`，则不会自动关闭。注意：`duration`接收一个`Number`，单位为毫秒，默认为`4500`。
```html
<template>
  <el-button
    plain
    @click="open">
    可自动关闭
  </el-button>
  <el-button
    plain
    @click="open2">
    不会自动关闭
    </el-button>
</template>

<script>
  export default {
    methods: {
      open() {
        const h = this.$createElement;

        this.$callpanel({
          title: '标题名称',
          message: h('i', { style: 'color: teal'}, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
        });
      },

      open2() {
        this.$callpanel({
          title: '提示',
          message: '这是一条不会自动关闭的消息',
          duration: 0
        });
      }
    }
  }
</script>
```
:::
