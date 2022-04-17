<template>
<div class="component-usage">
  <h3>1、基础用法</h3>
  <bs-tabs v-model="firstTab">
    <bs-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :label="pane.label"
      :name="pane.name"
      :disabled="pane.disabled">
      <ol v-if="pane.name === 'userManage'">
        <li v-for="item in 10" :key="item">用户{{ item + 1 }}</li>
      </ol>
      <p>{{ pane.label }}</p>
    </bs-tab-pane>
  </bs-tabs>

 <!-- <br>
  <hr>
  <h3>初始标签页为：[用户管理]</h3>
  <div style="max-width: 400px;">
    <bs-tabs v-model="tab2">
      <bs-tab-pane
        v-for="pane in panes"
        :key="pane.name"
        :label="pane.label"
        :name="pane.name"
        :disabled="pane.disabled">
        <ol v-if="pane.name === 'userManage'">
          <li v-for="item in 5" :key="item">用户{{ item }}</li>
        </ol>
        <p v-else>{{ pane.label }}</p>
      </bs-tab-pane>
    </bs-tabs>
  </div>-->

  <br>
  <hr>
  <h3>2、标签页长度超出父容器</h3>
  <div class="max-w-600">
    <bs-tabs v-model="firstTab">
      <bs-tab-pane
        v-for="pane in panes"
        :key="pane.name"
        :label="pane.label"
        :name="pane.name"
        :disabled="pane.disabled">
        <ol v-if="pane.name === 'userManage'">
          <li v-for="item in 10" :key="item">用户{{ item + 1 }}</li>
        </ol>
        <p>{{ pane.label }}</p>
      </bs-tab-pane>
    </bs-tabs>
  </div>

  <br>
  <hr>
  <h3>3、标签页长度超出父容器，切换隐藏标签方式为[more]</h3>
  <div style="max-width: 400px;">
    <bs-tabs triggerTypeOnOverflow="more">
      <bs-tab-pane
        v-for="pane in panes"
        :key="pane.name"
        :label="pane.label"
        :name="pane.name"
        :disabled="pane.disabled">
        <ol v-if="pane.name === 'userManage'">
          <li v-for="item in 10" :key="item">用户{{ item + 1 }}</li>
        </ol>
        <p>{{ pane.label }}</p>
      </bs-tab-pane>
    </bs-tabs>
  </div>

  <!--<br>
  <div class="max-w-600" style="overflow-x: scroll;white-space: nowrap;">
    <span>aaaaaaaaaaaaaaaa</span><bs-tabs style="display: inline-block;max-width: 500px;margin: 0 20px;"></bs-tabs>
  </div>
  <br>
  <br>-->
  <!--<bs-tabs></bs-tabs>-->
  <br>
  <hr>
  <h3>4、高亮条两端向外延伸长度为20px(inkBarSpaceBetween = 10)</h3>
  <bs-tabs :inkBarSpaceBetween="10">
    <bs-tab-pane
      v-for="pane in panes"
      :key="pane.name"
      :label="pane.label"
      :name="pane.name"
      :disabled="pane.disabled">
      <ol v-if="pane.name === 'userManage'">
        <li v-for="item in 10" :key="item">用户{{ item + 1 }}</li>
      </ol>
      <p>{{ pane.label }}</p>
    </bs-tab-pane>
  </bs-tabs>

  <hr>
  <h3>5、不同方向</h3>
  <div class="max-w-600">
    <bs-button type="primary" @click="direction = 'top'">上</bs-button>
    <bs-button type="primary" @click="direction = 'right'">右</bs-button>
    <bs-button type="primary" @click="direction = 'bottom'">下</bs-button>
    <bs-button type="primary" @click="direction = 'left'">左</bs-button>
    <bs-tabs
      tabBarMaxHeight="200px"
      :tab-position="direction"
      data-triggerTypeOnOverflow="more">
      <bs-tab-pane
        v-for="pane in panes"
        :key="pane.name"
        :label="pane.label"
        :name="pane.name"
        :disabled="pane.disabled">
        <ol v-if="pane.name === 'userManage'">
          <li v-for="item in 10" :key="item">用户{{ item + 1 }}</li>
        </ol>
        <p>{{ pane.label }}</p>
      </bs-tab-pane>
    </bs-tabs>
  </div>

  <br>
  <hr>
  <h3>6、可新增/关闭标签页</h3>
  <div>
    <bs-button type="primary" @click="addPane">新增标签页</bs-button>
    <bs-tabs
      :closeable="true"
      @close="onClose">
      <bs-tab-pane
        v-for="pane in panes2"
        :key="pane.name"
        :label="pane.label"
        :name="pane.name"
        :disabled="pane.disabled">
        <ol v-if="pane.name === 'userManage'">
          <li v-for="item in 10" :key="item">用户{{ item + 1 }}</li>
        </ol>
        <p>{{ pane.label }}</p>
      </bs-tab-pane>
    </bs-tabs>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';

export default defineComponent({
  name: 'BsTagUsage',
  components: {},

  setup (props: any) {
    let tab2 = ref('userManage');
    let firstTab = ref('');
    let firstLabel = ref('第一个标签');
    let panes = ref([
      { name: 'firstTab', label: '第一个标签', disabled: false },
      { name: 'articleManage', label: '文章管理', disabled: false },
      { name: 'articleCategory', label: '文章分类管理', disabled: true },
      { name: 'articleKeywords', label: '文章关键词管理', disabled: false },
      { name: 'userManage', label: '用户管理', disabled: false },
      { name: 'identityManage', label: '标识管理', disabled: false },
      { name: 'policyManage', label: '策略管理', disabled: false },
      { name: 'vpnPolicyManage', label: 'vpn管理', disabled: false },
      { name: 'appPublish', label: '应用发布管理', disabled: false }
    ]);

    let panes2 = ref(panes.value.slice(0, 3));

    let timer = setTimeout(function () {
      clearTimeout(timer);
      firstLabel.value = '第一个标签111';
    }, 1500);

    let direction = ref('');
    let onClose = function (name: string) {
      console.log('name', name);
      let index = panes2.value.findIndex(item => item.name == name);
      if (index > -1) {
        panes2.value.splice(index, 1);
      }
    };
    let addPane = function () {
      panes2.value.push({ name: `added_tab-${panes2.value.length + 1}`, label: `新增的标签_${panes2.value.length + 1}`, disabled: false });
    };
    return {
      tab2,
      firstTab,
      firstLabel,
      panes,
      panes2,
      direction,

      onClose,
      addPane
    };
  }
});
</script>

<style lang="scss" scoped>
.max-w-600{
  max-width: 600px;
}
.component-usage{
  max-width: 1200px;
  min-height: 1000px;
}
</style>
