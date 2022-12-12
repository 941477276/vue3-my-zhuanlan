<template>
  <div class="component-usage">
    <div>
      <hr>
      <h3>水平菜单</h3>
      <BsMenu
        :selected-keys="['overview', 'vpnOrgPolicy4']"
        data-sub-menu-trigger="click">
        <bs-menu-item data-keyIndex="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item keyIndex="overview">机构总览</bs-menu-item>
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
                <bs-menu-item keyIndex="vpnOrgPolicy4">组织策略4</bs-menu-item>
                <bs-menu-item keyIndex="vpnUserPolicy4">用户策略</bs-menu-item>
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

    <div>
      <hr>
      <h3>垂直菜单(折叠展开子菜单)</h3>
      <BsMenu
        mode="vertical"
        subMenuDisplayMode="collapse"
        :selected-keys="['kgc3']"
        :opened-keys="['vpnPolicyGroup3'/* , 'secretManageSub' */]"
        data-sub-menu-trigger="click">
        <bs-menu-item data-keyIndex="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item keyIndex="overview">机构总览</bs-menu-item>
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

    <div>
      <hr>
      <h3>垂直菜单（下拉展开子菜单）</h3>
      <BsMenu
        mode="vertical"
        subMenuDisplayMode="dropdown"
        :selected-keys="['kgc3']"
        data-sub-menu-trigger="click"
        @item-click="onMenuClick">
        <bs-menu-item data-keyIndex="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item keyIndex="overview">机构总览</bs-menu-item>
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
              <bs-sub-menu title="策略管理4" keyIndex="vpnPolicyGroup3">
                <bs-menu-item keyIndex="vpnOrgPolicy4">组织策略4</bs-menu-item>
                <bs-menu-item keyIndex="vpnUserPolicy4">用户策略4</bs-menu-item>
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

    <div>
      <hr>
      <h3>垂直菜单(手风琴式菜单)</h3>
      <BsMenu
        mode="vertical"
        subMenuDisplayMode="collapse"
        unique-opened
        data-sub-menu-trigger="click">
        <bs-menu-item data-keyIndex="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item keyIndex="overview">机构总览</bs-menu-item>
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

    <div>
      <hr>
      <h3>垂直菜单&#45;&#45;默认有选中项</h3>
      <BsMenu
        mode="vertical"
        subMenuDisplayMode="collapse"
        :selected-keys="['overview', 'vpnOrgPolicy3']"
        unique-opened
        data-sub-menu-trigger="click"
        @item-click="onMenuClick">
        <bs-menu-item data-keyIndex="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item keyIndex="overview">机构总览</bs-menu-item>
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
              <bs-sub-menu title="策略管理4" keyIndex="vpnPolicyGroup3">
                <bs-menu-item keyIndex="vpnOrgPolicy4">组织策略4</bs-menu-item>
                <bs-menu-item keyIndex="vpnUserPolicy4">用户策略4</bs-menu-item>
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
        <bs-sub-menu disabled keyIndex="secretManageSub">
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

    <div>
      <hr>
      <h3>垂直菜单（点击方式展开下拉子菜单）</h3>
      <BsMenu
        mode="vertical"
        subMenuDisplayMode="dropdown"
        sub-menu-trigger="click">
        <bs-menu-item data-keyIndex="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item keyIndex="overview">机构总览</bs-menu-item>
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

    <div>
      <hr>
      <h3>垂直菜单(收起菜单)</h3>
      <div style="margin-bottom: 1rem">
        <bs-button
          type="primary"
          @click="menuCollapsed = !menuCollapsed">展开/收起</bs-button>
      </div>
      <BsMenu
        mode="vertical"
        :collapse="menuCollapsed"
        subMenuDisplayMode="dropdown"
        data-sub-menu-trigger="click">
        <bs-menu-item data-keyIndex="dashboard" title="仪表盘">
          <template #icon>
            <img src="./test-usage-assets/dash-board.svg" alt="dashboard" class="icon-dashboard">
          </template>
          仪表盘
        </bs-menu-item>
        <bs-menu-item keyIndex="overview">机构总览</bs-menu-item>
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
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch
} from 'vue';
import BsMenu from './BsMenu.vue';
// import { AppstoreOutlined, MailOutlined, QqOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import BsSubMenu from '@/components/bootstrap/bs-menu/widgets/BsSubMenu';
// import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'BsMenuUsage',
  components: {
    BsSubMenu,
    BsMenu
    // MailOutlined,
    // QqOutlined,
    // AppstoreOutlined,
    // SettingOutlined
    // MailOutlined,
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

    let menuCollapsed = ref(true);

    const current = ref<string[]>(['mail', 'setting:1']);
    return {
      selectedKeys,
      openKeys,
      menuCollapsed,
      current,

      handleClick,
      titleClick,
      onMenuClick (itemOptions: any, evt: MouseEvent) {
        console.log('菜单点击了', itemOptions);
      }
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
