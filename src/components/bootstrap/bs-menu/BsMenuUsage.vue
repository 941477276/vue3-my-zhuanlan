<template>
  <div class="component-usage">
    <!--<div>
      <h3>水平菜单</h3>
      <BsMenu>
        <bs-menu-item key="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item class="is-selected" key="overview" icon="check-circle-fill">机构总览</bs-menu-item>
        <bs-sub-menu class="bs-submenu-selected" key="userManageSub" icon="eye" title="用户管理">
          <bs-menu-item key="orgManage">组织管理</bs-menu-item>
          <bs-menu-item class="is-disabled" key="userManage">用户管理</bs-menu-item>
          <bs-menu-item key="userPartTime">一人多岗</bs-menu-item>
        </bs-sub-menu>
        <bs-menu-item class="is-disabled" key="identification">
          <template #icon>
            <img src="./test-usage-assets/identification.png" alt="" class="icon-identification">
          </template>
          标识管理
        </bs-menu-item>
        <bs-sub-menu key="secretManageSub">
          <template #title>密钥管理</template>
          <bs-menu-item key="kmip">数据库密钥</bs-menu-item>
          <bs-menu-item key="kgc">库内密钥</bs-menu-item>
        </bs-sub-menu>
        <bs-sub-menu key="vpnPolicyManageSub">
          <template #icon>
            <i class="icon-vpn-policy-manage"></i>
          </template>
          <template #title>VPN策略管理</template>
          <bs-menu-item-group key="vpnPolicyAttrGroup" title="策略属性管理">
            <bs-menu-item key="vpnPolicyTimeObject">时间对象</bs-menu-item>
            <bs-menu-item key="vpnPolicyTargetIP">目标IP</bs-menu-item>
          </bs-menu-item-group>
          <bs-menu-item-group key="vpnPolicyGroup">
            <template #title>策略管理</template>
            <bs-menu-item key="vpnOrgPolicy">组织策略</bs-menu-item>
            <bs-menu-item key="vpnUserPolicy">用户策略</bs-menu-item>
          </bs-menu-item-group>
        </bs-sub-menu>
      </BsMenu>
    </div>-->

    <div>
      <hr>
      <h3>垂直菜单</h3>
      <BsMenu
        mode="vertical"
        subMenuDisplayMode="dropdown"
        data-sub-menu-trigger="click">
        <bs-menu-item data-keyIndex="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item class="is-selected" keyIndex="overview" icon="check-circle-fill">机构总览</bs-menu-item>
        <bs-menu-item keyIndex="overview1">机构总览1</bs-menu-item>
        <bs-sub-menu keyIndex="userManageSub" icon="eye" title="用户管理">
          <bs-menu-item keyIndex="orgManage">组织管理</bs-menu-item>
          <bs-menu-item disabled keyIndex="userManage">用户管理</bs-menu-item>
          <bs-menu-item keyIndex="userPartTime">一人多岗</bs-menu-item>
          <bs-sub-menu keyIndex="secretManageSub3">
            <template #title>密钥管理3</template>
            <bs-menu-item keyIndex="kmip3">数据库密钥3</bs-menu-item>
            <bs-menu-item keyIndex="kgc3">库内密钥3</bs-menu-item>
            <bs-menu-item-group keyIndex="vpnPolicyGroup2">
              <template #title>策略管理3</template>
              <bs-menu-item keyIndex="vpnOrgPolicy3">组织策略3</bs-menu-item>
              <bs-sub-menu title="策略管理3" keyIndex="vpnPolicyGroup3">
                <bs-menu-item keyIndex="vpnOrgPolicy3">组织策略3</bs-menu-item>
                <bs-menu-item keyIndex="vpnUserPolicy3">用户策略3</bs-menu-item>
              </bs-sub-menu>
              <bs-menu-item keyIndex="vpnUserPolicy3">用户策略3</bs-menu-item>
            </bs-menu-item-group>
          </bs-sub-menu>
        </bs-sub-menu>
        <bs-menu-item keyIndex="identification">
          <template #icon>
            <img src="./test-usage-assets/identification.png" alt="" class="icon-identification">
          </template>
          标识管理
        </bs-menu-item>
        <bs-sub-menu keyIndex="secretManageSub">
          <template #title>密钥管理</template>
          <bs-menu-item keyIndex="kmip">数据库密钥</bs-menu-item>
          <bs-menu-item keyIndex="kgc">库内密钥</bs-menu-item>
        </bs-sub-menu>
        <bs-sub-menu keyIndex="vpnPolicyManageSub">
          <template #icon>
            <i class="icon-vpn-policy-manage"></i>
          </template>
          <template #title>VPN策略管理</template>
          <bs-menu-item-group keyIndex="vpnPolicyAttrGroup" title="策略属性管理">
            <bs-menu-item keyIndex="vpnPolicyTimeObject">时间对象</bs-menu-item>
            <bs-menu-item keyIndex="vpnPolicyTargetIP">目标IP</bs-menu-item>
          </bs-menu-item-group>
          <bs-menu-item-group keyIndex="vpnPolicyGroup">
            <template #title>策略管理</template>
            <bs-menu-item keyIndex="vpnOrgPolicy">组织策略</bs-menu-item>
            <bs-menu-item-group keyIndex="vpnPolicyGroup2">
              <template #title>策略管理2</template>
              <bs-menu-item keyIndex="vpnOrgPolicy2">组织策略2</bs-menu-item>
              <bs-menu-item keyIndex="vpnUserPolicy2">用户策略2</bs-menu-item>
            </bs-menu-item-group>
            <bs-menu-item keyIndex="vpnUserPolicy">用户策略</bs-menu-item>
          </bs-menu-item-group>
        </bs-sub-menu>
      </BsMenu>
    </div>
    <!--<a-menu
      id="dddddd"
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      style="width: 256px"
      mode="inline"
      inline-collapsed
      @click="handleClick"
    >
      <a-sub-menu key="sub1" @titleClick="titleClick">
        <template #icon>
          <MailOutlined/>
        </template>
        <template #title>Navigation One</template>
        <a-menu-item-group key="g1">
          <template #icon>
            <QqOutlined/>
          </template>
          <template #title>Item 1</template>
          <a-menu-item key="1">Option 1</a-menu-item>
          <a-menu-item key="2">Option 2</a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group key="g2" title="Item 2">
          <a-menu-item key="3">Option 3</a-menu-item>
          <a-menu-item key="4">Option 4</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
      <a-sub-menu key="sub2" @titleClick="titleClick">
        <template #icon>
          <AppstoreOutlined/>
        </template>
        <template #title>Navigation Two</template>
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-sub-menu key="sub3" title="Submenu">
          <a-menu-item key="7">Option 7</a-menu-item>
          <a-menu-item key="8">Option 8</a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu key="sub4">
        <template #icon>
          <SettingOutlined/>
        </template>
        <template #title>Navigation Three</template>
        <a-menu-item key="9">Option 9</a-menu-item>
        <a-menu-item key="10">Option 10</a-menu-item>
        <a-menu-item key="11">Option 11</a-menu-item>
        <a-menu-item key="12">Option 12</a-menu-item>
      </a-sub-menu>
    </a-menu>-->
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch
} from 'vue';
import BsMenu from './BsMenu.vue';
// import { AppstoreOutlined, MailOutlined, QqOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import BsSubMenu from '@/components/bootstrap/bs-menu/widgets/BsSubMenu.vue';

export default defineComponent({
  name: 'BsMenuUsage',
  components: {
    BsSubMenu,
    BsMenu
    // MailOutlined,
    // QqOutlined,
    // AppstoreOutlined,
    // SettingOutlined
  },
  setup () {
    const selectedKeys = ref<string[]>(['1']);
    const openKeys = ref<string[]>(['sub1']);
    const handleClick: MenuProps['onClick'] = e => {
      console.log('click', e);
    };
    const titleClick = (e: Event) => {
      console.log('titleClick', e);
    };
    watch(
      () => openKeys,
      val => {
        console.log('openKeys', val);
      }
    );
    return {
      selectedKeys,
      openKeys,

      handleClick,
      titleClick
    };
  }
});
</script>

<style lang="scss">
@import "./test-usage-assets/fonts/iconfont.css";
</style>

<style lang="scss" scoped>
.bs-menu-vertical{
  width: 300px;
}
.icon-dashboard,
.icon-identification{
  display: block;
  width: 1rem;
  height: 1rem;
}
</style>
