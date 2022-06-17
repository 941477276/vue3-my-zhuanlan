<script lang="ts">
import {
  defineComponent,
  h,
  inject
} from 'vue';
import {
  bsTreeContextKey,
  TreeContext
} from '@/ts-tokens/bootstrap/tree';

export default defineComponent({
  name: 'BsTreeNodeLabel',
  props: {
    nodeData: { // 节点数据
      type: Object,
      default () {
        return {};
      }
    },
    labelKey: { // 节点标题的属性名
      type: [String, Function],
      default: 'label'
    },
    renderContent: { // 树节点的内容区的渲染函数
      type: Function,
      default: null
    },
    node: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  setup (props: any, ctx: any) {
    const treeCtx = inject<TreeContext>(bsTreeContextKey)!;
    return function () {
      if (!treeCtx.ctx.slots.default) {
        if (typeof props.renderContent === 'function') {
          return props.renderContent(props.nodeData, props.node);
        } else {
          let labelKey = props.labelKey;
          let labelKeyType = typeof labelKey;
          if (labelKeyType === 'function') {
            return h('div', {
              className: 'bs-tree-node-label'
            }, labelKey(props.nodeData, props.node));
          } else if (labelKeyType !== 'undefined' && labelKey !== null) {
            return h('div', {
              className: 'bs-tree-node-label'
            }, props.nodeData[labelKey]);
          } else {
            return h('span', document.createComment('node-no-label'));
          }
        }
      } else {
        // console.log('有默认插槽', treeCtx.ctx.slots);
        return treeCtx.ctx.slots.default({
          data: props.nodeData,
          node: props.node
        });
      }
    };
  }
});
</script>
