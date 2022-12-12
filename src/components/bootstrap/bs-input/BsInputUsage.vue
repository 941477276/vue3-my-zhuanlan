<template>
<div class="component-usage">
  <div>
    <h3>基本使用</h3>
    <bs-input v-model="inputValue" size="">
    </bs-input>
    <p style="margin-top: 5px;font-size: 1rem;">
      输入的内容为：<strong>{{inputValue}}</strong>
    </p>
  </div>

  <div>
    <hr>
    <h3>可清空</h3>
    <bs-input v-model="inputValue" size="" clearable>
    </bs-input>
  </div>

  <div>
    <hr>
    <h3>密码输入框</h3>
    <bs-input type="password" size="" :show-password="true"></bs-input>
  </div>

  <div>
    <hr>
    <h3>前缀和后缀</h3>
    <bs-input type="number" size="">
      <template #prefix>
        <span style="font-size: 14px">¥</span>
      </template>
      <template #suffix>
        <span style="font-size: 14px;">RMB</span>
      </template>
    </bs-input>
  </div>

  <div>
    <hr>
    <h3>slot</h3>
    <bs-input style="margin-bottom: 1rem;">
      <template #prepend>
        <!--一个前置slot-->
        <bs-input-text @click="prependSlotClick">一个前置slot</bs-input-text>
      </template>
    </bs-input>
    <bs-input style="margin-bottom: 1rem;">
      <template #append>
        <span class="input-group-text">后置slot</span>
        <bs-input-text>后置slot2</bs-input-text>
      </template>
    </bs-input>
    <bs-input style="margin-bottom: 1rem;">
      <template #prepend>
        <bs-input-text>一个前置slot</bs-input-text>
      </template>
      <template #append>
        <bs-input-text>后置slot2</bs-input-text>
      </template>
    </bs-input>
    <bs-input style="margin-bottom: 1rem;">
      <template #prepend>
        <bs-button type="primary">前置按钮</bs-button>
      </template>
    </bs-input>
    <bs-input style="margin-bottom: 1rem;">
      <template #append>
        <bs-button type="primary">后置按钮</bs-button>
      </template>
    </bs-input>
    <bs-input style="margin-bottom: 1rem;">
      <template #prepend>
        <bs-button type="primary" plain>前置按钮</bs-button>
        <bs-button type="success" plain>前置按钮</bs-button>
      </template>
    </bs-input>
    <bs-input style="margin-bottom: 1rem; width: 50%;">
      <template #prepend>
        <bs-select>
          <bs-option value="1">Html</bs-option>
          <bs-option value="2">Css</bs-option>
          <bs-option value="3">Javascript</bs-option>
        </bs-select>
        <bs-select>
          <bs-option value="1">Html</bs-option>
          <bs-option value="2">Css</bs-option>
          <bs-option value="3">Javascript</bs-option>
        </bs-select>
        <bs-button type="success" plain>前置按钮</bs-button>
      </template>
    </bs-input>
    <bs-input style="margin-bottom: 1rem; width: 50%;">
      <template #append>
        <bs-select>
          <bs-option value="1">Html</bs-option>
          <bs-option value="2">Css</bs-option>
          <bs-option value="3">Javascript</bs-option>
        </bs-select>
        <bs-select>
          <bs-option value="1">Html</bs-option>
          <bs-option value="2">Css</bs-option>
          <bs-option value="3">Javascript</bs-option>
        </bs-select>
        <!--<bs-button type="success" plain>前置按钮</bs-button>-->
      </template>
    </bs-input>

    <bs-input style="margin-bottom: 1rem; width: 50%;">
      <template #prepend>
        <bs-dropdown>
          <bs-button type="primary">下拉菜单</bs-button>
          <template #dropdown-content>
            <bs-dropdown-item value="1">Html</bs-dropdown-item>
            <bs-dropdown-item value="2">Css</bs-dropdown-item>
            <bs-dropdown-item value="3">Javascript</bs-dropdown-item>
          </template>
        </bs-dropdown>
        <bs-dropdown>
          <bs-button type="primary">下拉菜单2</bs-button>
          <template #dropdown-content>
            <bs-dropdown-item value="1">Html</bs-dropdown-item>
            <bs-dropdown-item value="2">Css</bs-dropdown-item>
            <bs-dropdown-item value="3">Javascript</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </template>
    </bs-input>

    <bs-input style="margin-bottom: 1rem; width: 50%;">
      <template #append>
        <bs-dropdown>
          <bs-button type="primary">下拉菜单</bs-button>
          <template #dropdown-content>
            <bs-dropdown-item value="1">Html</bs-dropdown-item>
            <bs-dropdown-item value="2">Css</bs-dropdown-item>
            <bs-dropdown-item value="3">Javascript</bs-dropdown-item>
          </template>
        </bs-dropdown>
        <bs-dropdown>
          <bs-button type="success">下拉菜单2</bs-button>
          <template #dropdown-content>
            <bs-dropdown-item value="1">Html</bs-dropdown-item>
            <bs-dropdown-item value="2">Css</bs-dropdown-item>
            <bs-dropdown-item value="3">Javascript</bs-dropdown-item>
          </template>
        </bs-dropdown>
      </template>
    </bs-input>

    <bs-input style="margin-bottom: 1rem; width: 50%;">
      <template #prepend>
        <bs-input-text>
          <bs-radio name="a1"></bs-radio>
          <bs-radio name="a1"></bs-radio>
        </bs-input-text>
      </template>
    </bs-input>
    <bs-input style="margin-bottom: 1rem; width: 50%;">
      <template #prepend>
        <bs-input-text>
          <bs-checkbox></bs-checkbox>
        </bs-input-text>
      </template>
    </bs-input>
  </div>

  <div>
    <hr>
    <h3>文本域</h3>
    <bs-input style="margin-bottom: 25px;" type="textarea" v-model="textareaVal"></bs-input>
    <bs-input type="textarea" v-model="textareaVal">
      <template #append>
        <bs-input-text>后置slot</bs-input-text>
      </template>
    </bs-input>
  </div>

  <div>
    <hr>
    <h3>前后自定义图标</h3>
    <p>当使用前后自定义图标时，图标当样式及输入框当padding需自行调整</p>
    <h5>带前置图标的输入框</h5>
    <bs-input placeholder="请输入名称进行查找" prefix-icon="search" style="margin-bottom: 1rem;">
      <template #prefix>
        <BsiSearch></BsiSearch>
      </template>
    </bs-input>
    <h5>带后置图标的输入框</h5>
    <bs-input suffix-icon="search">
      <template #suffix>
        <BsiSearch></BsiSearch>
      </template>
    </bs-input>
  </div>

 <div>
   <h3>不同大小</h3>
   <h5>默认大小</h5>
   <bs-input style="margin-bottom: 1rem;"></bs-input>

   <h5>大的输入框( <code>size="lg"</code> )</h5>
   <bs-input size="lg" style="margin-bottom: 1rem;"></bs-input>

   <h5>小的输入框( <code>size="sm"</code> )</h5>
   <bs-input size="sm"></bs-input>
 </div>
  <hr>

  <hr>
  <h3>禁用的输入框</h3>
  <bs-input disabled></bs-input>
  <hr>
  <h3>只读的输入框</h3>
  <bs-input value="fsdfsd" readonly max="10"></bs-input>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BsDropdownItem from '@/components/bootstrap/bs-dropdown/widgets/BsDropdownItem.vue';
import { BsiSearch } from 'vue3-bootstrap-icon/es/icons/BsiSearch';

export default defineComponent({
  name: 'BsInputUsage',
  components: {
    BsDropdownItem,
    BsiSearch
  },
  setup (props: any) {
    let inputValue = ref('哈哈');
    let inputValue2 = ref('');
    let textareaVal = ref('文本框');
    return {
      inputValue,
      textareaVal,
      prependSlotClick (evt: MouseEvent) {
        console.log('前置slot点击事件！', evt);
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.bs-input{
  width: 300px;
}
</style>
