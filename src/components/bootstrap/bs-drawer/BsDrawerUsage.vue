<template>
  <div class="component-usage">
    <header class="fixed-header">
      <h2>Drawer</h2>
    </header>
    <h3>基本使用</h3>
    <bs-button type="primary" @click="visible = true">显示抽屉弹窗</bs-button>
    <BsDrawer
      v-model:visible="visible"
      title="抽屉弹窗">
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <bs-select>
        <bs-option value="Html">Html</bs-option>
        <bs-option value="Css">Css</bs-option>
        <bs-option value="Javascript">Javascript</bs-option>
      </bs-select>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>
        <a href="###">
          <bs-tooltip content="一个工具提示">工具提示</bs-tooltip>
        </a>
      </p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <p>这是一个Bootstrap抽屉弹窗！</p>
      <template #footer>
        <bs-button type="primary">确定</bs-button>
      </template>
    </BsDrawer>

    <hr>
    <h3>不同方向</h3>
    <bs-button type="primary" @click="visible1 = true">top</bs-button>
    <bs-button type="primary" @click="visible2 = true">right</bs-button>
    <bs-button type="primary" @click="visible3 = true">bottom</bs-button>
    <bs-button type="primary" @click="visible4 = true">left</bs-button>
    <bs-drawer
      v-model:visible="visible1"
      placement="top"
      title="抽屉弹窗">
      <p>这是一个向上的抽屉弹窗！</p>
    </bs-drawer>
    <bs-drawer
      v-model:visible="visible2"
      placement="right"
      title="抽屉弹窗">
      <p>这是一个向右的抽屉弹窗！</p>
    </bs-drawer>
    <bs-drawer
      v-model:visible="visible3"
      placement="bottom"
      title="抽屉弹窗">
      <p>这是一个向下的抽屉弹窗！</p>
    </bs-drawer>
    <bs-drawer
      v-model:visible="visible4"
      placement="left"
      title="抽屉弹窗">
      <p>这是一个向左的抽屉弹窗！</p>
    </bs-drawer>
    <bs-drawer
      v-model:visible="visible5"
      width="70%"
      title="抽屉弹窗">
      <p>这是一个自定义大小的弹窗，宽度为70%！</p>
    </bs-drawer>

    <hr>
    <h3>异步关闭</h3>
    <bs-button type="primary" @click="visible11 = true">创建用户</bs-button>
    <bs-drawer
      title="创建用户"
      :close-disabled="closeDisabled"
      v-model:visible="visible11">
      <h5>在“确定”按钮转圈圈期间点击任何位置都无法关闭弹窗！</h5>
      <template #footer>
        <bs-button
          type="primary"
          :loading="closeDisabled"
          :disabled="closeDisabled"
          @click="createUser">提交</bs-button>
      </template>
    </bs-drawer>

    <hr>
    <h3>弹窗嵌套</h3>
    <bs-button type="primary" @click="visible12 = true">显示弹窗</bs-button>
    <bs-drawer
      title="一级弹窗"
      v-model:visible="visible12"
      width="50%">
      <h5>一级弹窗</h5>
      <bs-button type="primary" @click="visible13 = true">显示二级弹窗</bs-button>
      <bs-drawer
        title="二级弹窗"
        v-model:visible="visible13"
        width="30%">
        <h5>二级弹窗</h5>
        <bs-button type="primary" @click="visible14 = true">显示三级弹窗</bs-button>
        <bs-drawer
          title="三级弹窗"
          width="15%"
          v-model:visible="visible14">
          <h5>三级弹窗</h5>
        </bs-drawer>
      </bs-drawer>
    </bs-drawer>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';
import { BsMessage } from '@/components/bootstrap/bs-message';
import BsDrawer from '@/components/bootstrap/bs-drawer/BsDrawer.vue';

export default defineComponent({
  name: 'BsDrawerUsage',
  components: { BsDrawer },

  setup () {
    let visible = ref(false);
    let visible1 = ref(false);
    let visible2 = ref(false);
    let visible3 = ref(false);
    let visible4 = ref(false);
    let visible5 = ref(false);
    let visible6 = ref(false);
    let visible7 = ref(false);
    let visible8 = ref(false);
    let visible9 = ref(false);
    let visible10 = ref(false);
    let visible11 = ref(false);
    let visible12 = ref(false);
    let visible13 = ref(false);
    let visible14 = ref(false);
    let visible15 = ref(false);
    let visible16 = ref(false);
    let draggable = ref(true);

    let closeDisabled = ref(false);
    let createUser = function () {
      if (closeDisabled.value) {
        return;
      }
      closeDisabled.value = true;
      return new Promise(function (resolve) {
        let timer = setTimeout(function () {
          clearTimeout(timer);
          closeDisabled.value = false;
          // 如果这里resolve(false)则弹窗不会主动关闭
          // resolve(true);
          resolve(true);

          BsMessage.success?.('用户创建成功！你可以关闭弹窗了！');
        }, 3000);
      });
    };
    return {
      visible,
      visible1,
      visible2,
      visible3,
      visible4,
      visible5,
      visible6,
      visible7,
      visible8,
      visible9,
      visible10,
      visible11,
      visible12,
      visible13,
      visible14,
      visible15,
      visible16,
      draggable,

      closeDisabled,

      createUser
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  padding-top: 60px;
  min-height: 1000px;
}
.fixed-header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ccc;
  text-align: right;
  background-color: #fff;
}
</style>
