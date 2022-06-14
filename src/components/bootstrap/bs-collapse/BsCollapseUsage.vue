<template>
  <div class="component-usage">
    <div class="container">
      <h3>基本使用</h3>
      <bs-collapse v-model="activeNames">
        <BsCollapseItem title="Html">
          <h3>Html</h3>
          <p>HTML的全称为超文本标记语言，是一种标记语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。</p>
          <p>HTML文本是由HTML命令组成的描述性文本，HTML命令可以说明文字，图形、动画、声音、表格、链接等。</p>
          <p>
            超文本是一种组织信息的方式，它通过超级链接方法将文本中的文字、图表与其他信息媒体相关联。这些相互关联的信息媒体可能在同一文本中，也可能是其他文件，或是地理位置相距遥远的某台计算机上的文件。这种组织信息方式将分布在不同位置的信息资源用随机方式进行连接，为人们查找，检索信息提供方便。
          </p>
        </BsCollapseItem>
        <BsCollapseItem title="Javascript">Javascript</BsCollapseItem>
        <BsCollapseItem title="Css">Css</BsCollapseItem>
        <BsCollapseItem title="Angular" disabled>Angular</BsCollapseItem>
        <BsCollapseItem title="Vue">Vue</BsCollapseItem>
      </bs-collapse>

      <div>
        <hr>
        <h3>手风琴模式（每次只能打开一个面板）</h3>
        <bs-collapse v-model="activeNames2" accordion>
          <BsCollapseItem title="Html">
            <h3>Html</h3>
            <p>HTML的全称为超文本标记语言，是一种标记语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。</p>
            <p>HTML文本是由HTML命令组成的描述性文本，HTML命令可以说明文字，图形、动画、声音、表格、链接等。</p>
            <p>
              超文本是一种组织信息的方式，它通过超级链接方法将文本中的文字、图表与其他信息媒体相关联。这些相互关联的信息媒体可能在同一文本中，也可能是其他文件，或是地理位置相距遥远的某台计算机上的文件。这种组织信息方式将分布在不同位置的信息资源用随机方式进行连接，为人们查找，检索信息提供方便。
            </p>
          </BsCollapseItem>
          <BsCollapseItem title="Javascript">Javascript</BsCollapseItem>
          <BsCollapseItem title="Css">Css</BsCollapseItem>
          <BsCollapseItem title="Angular" disabled>Angular</BsCollapseItem>
          <BsCollapseItem title="Vue">Vue</BsCollapseItem>
        </bs-collapse>
      </div>

      <div>
        <hr>
        <h3>简洁模式</h3>
        <bs-collapse simple>
          <BsCollapseItem title="Html">
            <h3>Html</h3>
            <p>HTML的全称为超文本标记语言，是一种标记语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。</p>
            <p>HTML文本是由HTML命令组成的描述性文本，HTML命令可以说明文字，图形、动画、声音、表格、链接等。</p>
            <p>
              超文本是一种组织信息的方式，它通过超级链接方法将文本中的文字、图表与其他信息媒体相关联。这些相互关联的信息媒体可能在同一文本中，也可能是其他文件，或是地理位置相距遥远的某台计算机上的文件。这种组织信息方式将分布在不同位置的信息资源用随机方式进行连接，为人们查找，检索信息提供方便。
            </p>
          </BsCollapseItem>
          <BsCollapseItem title="Javascript">Javascript</BsCollapseItem>
          <BsCollapseItem title="Css">Css</BsCollapseItem>
          <BsCollapseItem title="Angular" disabled>Angular</BsCollapseItem>
          <BsCollapseItem title="Vue">Vue</BsCollapseItem>
        </bs-collapse>
      </div>

      <div>
        <hr>
        <h3>自定义头部</h3>
        <bs-collapse>
          <BsCollapseItem title="Html">
            <template #title>
              <strong style="color: #f00;font-size: 1.5em;">H</strong>
              <span style="align-self: flex-end;margin-left: 2px;">tml</span>
            </template>
            <h3>Html</h3>
            <p>HTML的全称为超文本标记语言，是一种标记语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。</p>
            <p>HTML文本是由HTML命令组成的描述性文本，HTML命令可以说明文字，图形、动画、声音、表格、链接等。</p>
            <p>
              超文本是一种组织信息的方式，它通过超级链接方法将文本中的文字、图表与其他信息媒体相关联。这些相互关联的信息媒体可能在同一文本中，也可能是其他文件，或是地理位置相距遥远的某台计算机上的文件。这种组织信息方式将分布在不同位置的信息资源用随机方式进行连接，为人们查找，检索信息提供方便。
            </p>
          </BsCollapseItem>
          <BsCollapseItem title="Javascript">Javascript</BsCollapseItem>
          <BsCollapseItem title="Css">Css</BsCollapseItem>
          <BsCollapseItem title="Angular" disabled>Angular</BsCollapseItem>
          <BsCollapseItem title="Vue">Vue</BsCollapseItem>
        </bs-collapse>
      </div>

      <div>
        <hr>
        <h3>嵌套</h3>
        <bs-collapse>
          <BsCollapseItem title="Html">
            <p>HTML的全称为超文本标记语言，是一种标记语言。它包括一系列标签．通过这些标签可以将网络上的文档格式统一，使分散的Internet资源连接为一个逻辑整体。</p>
            <bs-collapse>
              <BsCollapseItem title="图片">图片</BsCollapseItem>
              <BsCollapseItem title="视频">视频</BsCollapseItem>
              <BsCollapseItem title="音频">音频</BsCollapseItem>
              <BsCollapseItem title="文本">文本</BsCollapseItem>
            </bs-collapse>
          </BsCollapseItem>
          <BsCollapseItem title="Javascript">Javascript</BsCollapseItem>
          <BsCollapseItem title="Css">Css</BsCollapseItem>
          <BsCollapseItem title="Angular" disabled>Angular</BsCollapseItem>
          <BsCollapseItem title="Vue">Vue</BsCollapseItem>
        </bs-collapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsCollapseUsage',
  setup () {
    let activeNames = ref([0]);
    let activeNames2 = ref('');
    return {
      activeNames,
      activeNames2
    };
  }
});
</script>

<style lang="scss" scoped>

</style>
