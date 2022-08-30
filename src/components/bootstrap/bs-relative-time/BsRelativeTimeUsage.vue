<template>
  <div class="component-usage">
    <ol>
      <li>此刻：<BsRelativeTime :time="time1"></BsRelativeTime></li>
      <li>此刻<code>lang=en</code>：<BsRelativeTime :time="time1" lang="en"></BsRelativeTime></li>
      <li>30分钟前：<BsRelativeTime :time="time2"></BsRelativeTime></li>
      <li>30分钟前<code>lang=en</code>：<BsRelativeTime :time="time2" lang="en"></BsRelativeTime></li>
      <li>5小时前：<BsRelativeTime :time="time3"></BsRelativeTime></li>
      <li>13小时前：<BsRelativeTime :time="time4"></BsRelativeTime></li>
      <li>1天前：<BsRelativeTime :time="time5"></BsRelativeTime></li>
      <li>27天前：<BsRelativeTime :time="time6"></BsRelativeTime></li>
      <li>27天前<code>lang=en</code>：<BsRelativeTime :time="time6" lang="en"></BsRelativeTime></li>
      <li>57天前：<BsRelativeTime :time="time7"></BsRelativeTime></li>
      <li>2022/04/01 12:00:00：<BsRelativeTime :time="time8"></BsRelativeTime></li>
      <li>2021/05/13 00:00:00：<BsRelativeTime :time="time9"></BsRelativeTime></li>
      <li><code>viewType=date</code>：<BsRelativeTime :time="time10" view-type="date"></BsRelativeTime></li>
      <li><code>viewType=datetime</code>：<BsRelativeTime :time="time1" view-type="datetime"></BsRelativeTime></li>
      <li><code>viewType=datetime</code>（自定义格式）：<BsRelativeTime :time="time1" view-type="datetime" format="YYYY年MM月DD日 HH时mm分ss秒"></BsRelativeTime></li>
    </ol>
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import BsRelativeTime from './BsRelativeTime.vue';

export default defineComponent({
  name: 'BsRelativeTimeUsage',
  components: {
    BsRelativeTime
  },
  setup () {
    let now = new Date();
    return {
      time1: now,
      time2: now.getTime() - (30 * 60 * 1000),
      time3: now.getTime() - (5 * 60 * 60 * 1000),
      time4: now.getTime() - (13 * 60 * 60 * 1000),
      time5: now.getTime() - (24 * 60 * 60 * 1000),
      time6: now.getTime() - (27 * 24 * 60 * 60 * 1000),
      time7: now.getTime() - (57 * 24 * 60 * 60 * 1000),
      time8: '2022/04/01 12:00:00',
      time9: new Date('2021/05/13 00:00:00'),
      time10: new Date('2021/05/13 00:00:00')
    };
  }
});
</script>

<style lang="scss" scoped>
ol li{
  list-style: decimal;
}
</style>
