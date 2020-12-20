<template>
  <a-layout >
    <a-layout-sider
      @collapse="handleCollapsed"
      v-model="collapsed"
      collapsible
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0}">
      <div class="menu-top-btn menu-transition" @click="() => {this.$router.back()}">
        <a-icon type="arrow-left"/>
        <span>{{ collapsed?'':'返回' }}</span>
      </div>
      <a-button
        class="menu-add-dir-btn menu-transition"
        type="primary"
        shape="round"
        icon="folder-add"
      >{{ collapsed?'':'新建文件' }}
      </a-button>
      <a-menu
        class="menu-wrapper"
        v-model="selectedKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
      >
        <a-menu-item v-for=" dir in menus" :key="dir.did">
          <a-icon :type="menus[selectedKeys-1] !== dir?'folder':'folder-open'" />
          <span>{{ dir.dirName }}</span>
          <a-icon
            type="edit"
            style="right: 0;position: absolute; top: 35%"
            v-if="!collapsed && menus[selectedKeys-1] === dir"
            @click="() => {$message.info('只是一个DEMO') }"
          />
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  </a-layout>
</template>

<script>
export default {
  data () {
    return {
      collapsed: false,
      addBtnTitle: '新建文件',
      selectedKeys: [1],
      menus: [{
        did: 1,
        dirName: '文件夹1'
      }, {
        did: 2,
        dirName: '文件夹2'
      }, {
        did: 3,
        dirName: '文件夹3'
      }, {
        did: 4,
        dirName: '文件夹4'
      }, {
        did: 5,
        dirName: '文件夹5'
      }]
    }
  },
  methods: {
    handleCollapsed (collapsed, type) {
      console.log(collapsed, type)
    }
  }
}
</script>
<style lang="less" scoped>

.menu-top-btn{
  height: 50px;
  display: flex;
  color: white;
  align-items: center;
  justify-content: flex-start;
  font-family: inherit;
  padding-top: 20px;
  margin-bottom: 20px;

  i{
    color: inherit;
    font-size: 24px;
    padding-left: 15px;
    cursor: pointer;
  }
  span{
    padding-left: 10px;
    color: inherit;
    font-size: 18px;
  }
}

.menu-add-dir-btn{
  margin: 20px 15px 20px 15px;
}
</style>
