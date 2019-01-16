import TimelineTree from './src/tree.vue';

/* istanbul ignore next */
TimelineTree.install = function(Vue) {
  Vue.component(TimelineTree.name, TimelineTree);
};

export default TimelineTree;
