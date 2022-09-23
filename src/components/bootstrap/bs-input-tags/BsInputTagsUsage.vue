<template>
  <div class="component-usage">
    <div>
      <h3>基本使用</h3>
      <BsInputTags
        v-model="values1"></BsInputTags>
    </div>
    <div>
      <hr>
      <h3>多选</h3>
      <BsInputTags
        v-model="values2"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        :loading="false"
        @tag-close="onTagClose2"></BsInputTags>
      <br>
      <h5>限制个数(最多5个)</h5>
      <BsInputTags
        v-model="values5"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        :loading="false"
        :tag-limit="5"
        @limited="onLimited"
        @tag-close="onTagClose2"></BsInputTags>
    </div>

    <div>
      <hr>
      <h3>Loading</h3>
      <BsInputTags
        v-model="values1"
        loading
        style="margin-bottom: 1rem;"></BsInputTags>
      <BsInputTags
        v-model="values2"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        :loading="true"
        @tag-close="onTagClose2"></BsInputTags>
    </div>

    <div>
      <hr>
      <h3>禁用</h3>
      <BsInputTags
        disabled
        v-model="values1"
        loading
        style="margin-bottom: 1rem;"></BsInputTags>
      <BsInputTags
        disabled
        v-model="values2"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        :loading="true"
        @tag-close="onTagClose2"></BsInputTags>
    </div>

    <div>
      <hr>
      <h3>校验状态</h3>
      <BsInputTags
        ref="verifyStatusRef"
        style="margin-bottom: 1rem;"></BsInputTags>
      <bs-button type="success" @click="setVerifyStatus(1)">设置成功状态</bs-button>
      <bs-button type="warning" style="margin-left: 1rem;" @click="setVerifyStatus(2)">设置失败状态</bs-button>
    </div>

    <div>
      <hr>
      <h3>自定义Tag内容</h3>
      <BsInputTags
        v-model="values2"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        :loading="false"
        style="margin-bottom: 1rem;"
        @tag-close="onTagClose2">
        <template #tag="tag">
          {{ tag.label }}
          <small style="color: #f00;" v-if="tag.value == 'html'">(超文本标记语言)</small>
          <small style="color: #f00;" v-if="tag.value == 'css'">(层叠样式表)</small>
          <small style="color: #f00;" v-if="tag.value == 'javascript'">(脚本语言)</small>
        </template>
      </BsInputTags>
      <BsInputTags
        v-model="values2"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        :loading="false"
        :max-tag-count="3"
        @tag-close="onTagClose2">
        <template #maxTagPlaceholder="data">
          还有 <strong style="color: #f00;">{{ data.omittedCount }}</strong> 个Tag
        </template>
      </BsInputTags>
    </div>

    <div>
      <hr>
      <h3>自定义标签样式</h3>
      <BsInputTags
        v-model="values3"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        @tag-close="onTagClose3"></BsInputTags>
    </div>

    <div>
      <hr>
      <h3>标签禁用关闭</h3>
      <BsInputTags
        v-model="values4"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        @tag-close="onTagClose4"></BsInputTags>
    </div>

    <div>
      <hr>
      <h3>不同大小</h3>
      <h6>大的</h6>
      <BsInputTags
        v-model="values6"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        size="lg"
        @tag-close="onTagClose4"></BsInputTags>
      <h6 style="margin: 1rem 0;">中等的</h6>
      <BsInputTags
        v-model="values6"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        @tag-close="onTagClose4"></BsInputTags>
      <h6 style="margin: 1rem 0;">小的</h6>
      <BsInputTags
        v-model="values6"
        :is-focus="false"
        :clearable="true"
        :multiple="true"
        :filterable="true"
        size="sm"
        @tag-close="onTagClose4"></BsInputTags>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  reactive,
  defineComponent
} from 'vue';
import BsInputTags from './BsInputTags.vue';

export default defineComponent({
  name: 'BsInputTagsUsage',
  components: {
    BsInputTags
  },
  setup () {
    let values1 = ref([{ label: 'HTML', value: 'html' }]);
    let values2 = ref([
      { label: 'HTML', value: 'html', tagEffect: 'plain', tagType: 'primary' },
      { label: 'Css', value: 'css' },
      { label: 'Javascript', value: 'javascript' },
      { label: 'Vue.js', value: 'vue' },
      { label: 'React.js', value: 'react' }
    ]);
    let onTagClose2 = function (tag: any) {
      console.log('tag标签关闭事件');
      let index = values2.value.findIndex(item => item.value === tag.value);
      if (index > -1) {
        values2.value.splice(index, 1);
      }
    };

    let values3 = ref([
      { label: 'HTML', value: 'html', tagType: 'primary' },
      { label: 'Css', value: 'css' },
      { label: 'Javascript', value: 'javascript', tagType: 'success' },
      { label: 'Vue.js', value: 'vue', tagType: 'warning' },
      { label: 'React.js', value: 'react', tagType: 'danger' },
      { label: 'Angular.js', value: 'angular', tagClass: 'angular-tag' }
    ]);
    let onTagClose3 = function (tag: any) {
      console.log('tag标签关闭事件');
      let index = values3.value.findIndex(item => item.value === tag.value);
      if (index > -1) {
        values3.value.splice(index, 1);
      }
    };

    let values4 = ref([
      { label: 'HTML', value: 'html', disabled: true },
      { label: 'Css', value: 'css', disabled: true },
      { label: 'Javascript', value: 'javascript', disabled: true },
      { label: 'Vue.js', value: 'vue' },
      { label: 'React.js', value: 'react' },
      { label: 'Angular.js', value: 'angular' }
    ]);

    let values5 = ref([
      { label: 'HTML', value: 'html', tagEffect: 'plain', tagType: 'primary' },
      { label: 'Css', value: 'css' },
      { label: 'Javascript', value: 'javascript' }
      // { label: 'Vue.js', value: 'vue' },
      // { label: 'React.js', value: 'react' }
    ]);
    let values6 = ref([
      { label: 'HTML', value: 'html' }
      // { label: 'Css', value: 'css' }
      // { label: 'Vue.js', value: 'vue' },
      // { label: 'React.js', value: 'react' }
    ]);
    let onTagClose4 = function (tag: any) {
      console.log('tag标签关闭事件');
      /* let index = values4.value.findIndex(item => item.value === tag.value);
      if (index > -1) {
        values4.value.splice(index, 1);
      } */
    };

    let verifyStatusRef = ref(null);
    return {
      values1,
      values2,
      values3,
      values4,
      values5,
      values6,
      verifyStatusRef,

      onTagClose2,
      onTagClose3,
      onTagClose4,
      onLimited () {
        alert('标签数量不能超过5个！');
      },

      setVerifyStatus (type: number) {
        (verifyStatusRef as any).value.setValidateStatus(type == 1 ? 'success' : 'error');
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-input-tags{
  max-width: 260px;
}
:deep(.angular-tag){
  border-color: #cd2f55;
  font-weight: bold;
  color: #fff;
  background-color: #C50030;
}
</style>
