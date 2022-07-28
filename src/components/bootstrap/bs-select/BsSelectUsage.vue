<template>
<div class="component-usage">
  <div>
    <h3 style="margin-top: 200px;margin-bottom: 15px;">基本使用</h3>
    <h6 style="margin: 0.5rem 0 1rem 0;">使用 <code>&lt;bs-option&gt;</code> 组件渲染</h6>
    <bs-select v-model="selectVal" clearable>
      <bs-option value="a" v-if="show">第1个选项</bs-option>
      <bs-option-group label="组1">
        <bs-option value="group-value1">组1第1个选项</bs-option>
        <bs-option value="group-value2" label="组1第2个选项"></bs-option>
      </bs-option-group>
      <bs-option value="b" label="第2个选项"></bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
      <bs-option :value="4">第4个选项，值为number类型</bs-option>
      <bs-option value="5" :disabled="true">禁用的</bs-option>
      <bs-option value="6">未被禁用的</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">使用 <code>options</code> 选项渲染</h6>
    <bs-select
      v-model="selectVal"
      :options="options1"
      clearable></bs-select>
  </div>

  <div>
    <hr>
    <h3 style="margin-top: 50px;margin-bottom: 15px;">多选</h3>
    <bs-select
      v-model="selectVals"
      multiple
      clearable
      :multiple-limit="4"
      @select-limit="onMultipleLimit">
      <bs-option-group label="组1">
        <bs-option value="group-value1">第1个选项</bs-option>
        <bs-option value="group-value2" label="第2个选项"></bs-option>
        <bs-option :value="3">第3个选项，值为number类型</bs-option>
      </bs-option-group>
      <bs-option value="4">第4个选项</bs-option>
      <bs-option :value="true" label="第5个选项，值为boolean类型"></bs-option>
      <bs-option value="6" :disabled="true">禁用项</bs-option>
      <bs-option-group label="组2">
        <bs-option value="group-value7">第7个选项</bs-option>
        <bs-option value="group-value8" :disabled="true">第8个选项</bs-option>
      </bs-option-group>
      <bs-option-group label="组3（禁用的）" disabled>
        <bs-option value="group-value9">第9个选项</bs-option>
        <bs-option value="group-value10">第10个选项</bs-option>
      </bs-option-group>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3>自定义模板</h3>
    <h6 style="margin: 0.5rem 0 1rem 0;">使用 <code>&lt;bs-option&gt;</code> 组件渲染</h6>
    <bs-select v-model="selectVal" clearable>
      <bs-option value="a" v-if="show">
        <div class="custom-option-content">第1个选项 <small>(值: a)</small></div>
      </bs-option>
      <bs-option-group label="组1">
        <bs-option value="group-value1">
          <div class="custom-option-content">组1第1个选项 <small>(值: group-value1)</small></div>
        </bs-option>
        <bs-option value="group-value2" label="组1第2个选项">
          <div class="custom-option-content">组1第2个选项 <small>(值: group-value2)</small></div>
        </bs-option>
      </bs-option-group>
      <bs-option value="b" label="第2个选项">
        <div class="custom-option-content">第2个选项 <small>(值: b)</small></div>
      </bs-option>
      <bs-option :value="3">
        <div class="custom-option-content">第3个选项，值为number类型 <small>(值: 3)</small></div>
      </bs-option>
      <bs-option :value="4">
        <div class="custom-option-content">第4个选项，值为number类型 <small>(值: 4)</small></div>
      </bs-option>
      <bs-option value="5" :disabled="true">
        <div class="custom-option-content">禁用的 <small>(值: 5)</small></div>
      </bs-option>
      <bs-option value="6">
        <div class="custom-option-content">未被禁用的 <small>(值: 6)</small></div>
      </bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">使用 <code>options</code> 选项渲染</h6>
    <bs-select
      v-model="selectVal"
      :options="options1"
      clearable>
      <template #option="data">
        <div class="custom-option-content">{{ data.option.label }} <small>(值: {{ data.option.value }})</small></div>
      </template>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3>可搜索</h3>
    <h6 style="margin: 0.5rem 0 1rem 0;">单选（可搜索）</h6>
    <bs-select
      v-model="selectVal2"
      clearable
      filterable>
      <bs-option value="option1">第1个选项</bs-option>
      <bs-option value="option2" label="第2个选项"></bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
      <bs-option :value="4">第4个选项，值为number类型</bs-option>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="5" :disabled="true">禁用项</bs-option>
    </bs-select>

    <h6 style="margin: 0.5rem 0 1rem 0;">多选（可搜索）</h6>
    <bs-select
      v-model="selectVal3"
      multiple
      clearable
      filterable>
      <bs-option value="option1">第1个选项</bs-option>
      <bs-option value="option2" label="第2个选项"></bs-option>
      <bs-option :value="3">第3个选项，值为number类型</bs-option>
      <bs-option :value="4">第4个选项，值为number类型</bs-option>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="5" :disabled="true">禁用项</bs-option>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3>异步加载</h3>
    <bs-select
      style="margin-bottom: 1rem;"
      v-model="selectVal4"
      clearable
      filterable
      :loading="loading4">
      <bs-option
        v-for="item in options4"
        :key="item.value"
        :value="item.value">{{ item.label }}</bs-option>
    </bs-select>
    <bs-select
      v-model="selectVal9"
      clearable
      filterable
      multiple
      :loading="loading4">
      <bs-option
        v-for="item in options4"
        :key="item.value"
        :value="item.value">{{ item.label }}</bs-option>
    </bs-select>
    <bs-button type="primary" style="margin-top: 1rem" @click="loadData4">点击加载数据</bs-button>
  </div>

  <div>
    <hr>
    <h3>禁用和不同类型的Tag</h3>
    <h6 style="margin: 0.5rem 0 1rem 0;">禁用——单选</h6>
    <bs-select
      v-model="selectVal5"
      disabled
      filterable>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">禁用——多选</h6>
    <bs-select
      v-model="selectVal6"
      multiple
      disabled
      filterable>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="vue">Vue</bs-option>
      <bs-option value="react">React</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">禁用——多选(部分选项禁用)</h6>
    <bs-select
      v-model="selectVal6"
      multiple
      filterable>
      <bs-option value="html" disabled>Html</bs-option>
      <bs-option value="css" disabled>Css</bs-option>
      <bs-option value="javascript" disabled>Javascript</bs-option>
      <bs-option value="vue">Vue</bs-option>
      <bs-option value="react">React</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">不同类型的Tag</h6>
    <bs-select
      v-model="selectVal7"
      multiple
      filterable>
      <bs-option value="html" tag-type="primary">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript" tag-type="success">Javascript</bs-option>
      <bs-option value="vue" tag-type="info">Vue</bs-option>
      <bs-option value="react" tag-class="react-tag">React</bs-option>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3>自定义Tag内容</h3>
    <bs-select
      v-model="selectVal8"
      multiple
      filterable>
      <template #tag="tag">
        {{ tag.label }}
        <span style="color: #F95504;font-weight: bold;" v-if="tag.value === 'html'">(超文本传输语言)</span>
        <span style="color: #0EA001;font-weight: bold;" v-if="tag.value === 'css'">(层叠样式表)</span>
        <span style="color: #0E45E8;font-weight: bold;" v-if="tag.value === 'javascript'">(弱类型脚本语言)</span>
      </template>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="vue">Vue</bs-option>
      <bs-option value="react">React</bs-option>
    </bs-select>
    <h6 style="margin: 0.5rem 0 1rem 0;">溢出Tag</h6>
    <bs-select
      v-model="selectVal8"
      multiple
      filterable
      :max-tag-count="2">
      <template #maxTagPlaceholder="{ omittedCount }">
        隐藏了 <strong style="color: #f30;">{{omittedCount}}</strong> 个Tag
      </template>
      <bs-option value="html">Html</bs-option>
      <bs-option value="css">Css</bs-option>
      <bs-option value="javascript">Javascript</bs-option>
      <bs-option value="vue">Vue</bs-option>
      <bs-option value="react">React</bs-option>
    </bs-select>
  </div>

  <div>
    <hr>
    <h3>扩展菜单</h3>
    <bs-select>
      <bs-option
        v-for="item in options10"
        :key="item.value"
        :value="item.value">{{ item.label }}</bs-option>
      <template #extra>
        <hr>
        <bs-button type="primary" style="margin: 0 1rem 1rem;" @click="addOption10">添加选择项</bs-button>
      </template>
    </bs-select>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { SelectOptionItem } from '@/ts-tokens/bootstrap/select';

export default defineComponent({
  name: 'BsSelectUsage',
  components: {},

  setup (props: any) {
    let show = ref(true);
    let selectVal = ref('');
    let selectVals = ref([]);

    let options1 = ref([
      { value: 'a', label: '第1个选项' },
      {
        label: '组1',
        options: [
          { value: 'group-value1', label: '组1第1个选项' },
          { value: 'group-value2', label: '组1第2个选项' }
        ]
      },
      { value: 'b', label: '第2个选项' },
      { value: 3, label: '第3个选项，值为number类型' },
      { value: 4, label: '第4个选项，值为number类型' },
      { value: '5', label: '禁用的', disabled: true },
      { value: '6', label: '未被禁用的' }
    ]);

    let onMultipleLimit = function (limitCount: number) {
      alert(`最多只能选择${limitCount}项！`);
    };

    let selectVal2 = ref('');
    let selectVal3 = ref(['javascript']);

    let selectVal4 = ref('');
    let selectVal9 = ref(['html', 'javascript']);
    let options4 = ref<SelectOptionItem[]>([]);
    let loading4 = ref(true);
    let loadData4 = function () {
      loading4.value = true;
      let timer = setTimeout(function () {
        clearTimeout(timer);
        loading4.value = false;
        options4.value = [
          { id: '1', label: 'Html', value: 'html' },
          { id: '2', label: 'Css', value: 'css' },
          { id: '3', label: 'Javascript', value: 'javascript' },
          { id: '4', label: 'Vue', value: 'vue' }
        ];
      }, 1500);
    };

    let selectVal5 = ref('html');
    let selectVal6 = ref(['html', 'javascript']);
    let selectVal7 = ref(['html', 'javascript', 'css', 'vue', 'react']);

    let selectVal8 = ref(['html', 'javascript', 'css', 'vue', 'react']);

    let options10 = ref([
      { id: '1', label: 'Html', value: 'html' },
      { id: '2', label: 'Css', value: 'css' },
      { id: '3', label: 'Javascript', value: 'javascript' }
    ]);
    let addOption10 = function () {
      let optionLen = options10.value.length + 1;
      options10.value.push({
        id: optionLen + '',
        label: 'Item_' + optionLen,
        value: 'Value_' + optionLen
      });
    };

    return {
      show,
      selectVal,
      selectVals,
      options1,
      onMultipleLimit,

      selectVal2,
      selectVal3,

      selectVal4,
      selectVal9,
      options4,
      loading4,
      loadData4,

      selectVal5,
      selectVal6,
      selectVal7,
      selectVal8,

      options10,
      addOption10
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-select{
  //width: auto;
  max-width: 260px;
}
:deep(.react-tag){
  border-color: #61DAFB!important;
  background-color: #61DAFB!important;
  color: #fff!important;
}
.custom-option-content{
  overflow: hidden;
  small{
    float: right;
    color: #999;
  }
}
</style>
