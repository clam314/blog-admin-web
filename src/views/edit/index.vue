<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      @collapse="handleCollapsed"
      v-model="collapsed"
      collapsible>
      <div class="menu-top-btn menu-transition" @click="() => {this.$router.back()}">
        <a-icon :class="{'menu-top-btn-action-i': collapsed}" type="arrow-left"/>
        <span :class="{'menu-top-btn-action-span': !collapsed}">返回</span>
      </div>
      <a-button
        class="menu-add-dir-btn menu-transition"
        type="primary"
        shape="round"
        icon="folder-add"
      >{{ collapsed?'':'新建文件夹' }}
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
    <a-layout>
      <a-layout-sider
        class="article-list-wrapper"
        :style="[{maxWidth : articleListWidth + 'px'},{minWidth : articleListWidth + 'px'},{backgroundColor:'white'},{width : articleListWidth + 'px'}]"
        @collapse="handleCollapsed"
        v-model="collapsed"
      >
        <article-menu-list :collapsed="collapsed"/>
        <div class="article-list-wrapper-btn">
          <a-icon type="file-add" style="font-size: 16px;"/>
          <span :class="!collapsed ? 'article-list-wrapper-text':'article-list-wrapper-text-collapsed'">新建文档</span>
        </div>
      </a-layout-sider>
      <a-layout-content style="margin: 0 0; width: 100% ;height: 100%">
        <article-editor/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import ArticleMenuList from '@/views/edit/ArticleMenuList'
import ArticleEditor from '@/views/edit/ArticleEditor'

export default {
  components: {
    ArticleMenuList,
    ArticleEditor
  },
  data () {
  return {
    collapsed: false,
    addBtnTitle: '新建文件',
    selectedKeys: [1],
    mdValue: '',
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
  },
  computed: {
    articleListWidth () {
      return this.collapsed ? 120 : 300
    }
  }
}
</script>
<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.menu-top-btn{
  height: 50px;
  display: flex;
  color: white;
  align-items: center;
  justify-content: flex-start;
  font-family: inherit;
  padding-top: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  i{
    color: inherit;
    font-size: 24px;
    margin-left: 20px;
    transition: margin 0.3s ease-in-out;
  }
  &-action-i{
    margin-left: 30px !important;
    transition: margin 0.3s ease-in-out;
  }
  span{
    padding-left: 10px;
    color: inherit;
    font-size: 18px;
    min-width: 80px;
    display: inline-block;
    opacity: 0;
  }
  &-action-span{
    opacity: 1 !important;
    transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}

.menu-add-dir-btn{
  margin: 20px 15px 20px 15px;
}

.article-list-wrapper{
  height: 100vh;
  &-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    background-color: @primary-color;
    color: white;
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;

    &:hover{
      background-color: color(~`colorPalette('@{primary-color}', 5) `);
      color: white;
    }
  }
  &-text{
    margin-left: 15px;
    opacity: 1;
    transition: opacity 0.3s @ease-in-out ,margin 0.3s @ease-in-out;
  }
  &-text-collapsed{
    margin-left: 0;
    opacity: 0;
    white-space: nowrap;
    width: 0;
    transition: opacity 0.2s @ease-in-out ,margin 0.3s @ease-in-out ,width 0.3s @ease-in-out;
  }
}
</style>
