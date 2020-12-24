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
      <a-button class="menu-add-dir-btn menu-transition" type="primary" shape="round" icon="folder-add">
        {{ collapsed?'':'新建文件夹' }}
      </a-button>
      <div class="menu-wrapper">
        <a-menu
          v-model="selectedKeys"
          mode="inline"
          theme="dark"
          :inline-collapsed="collapsed"
          @click="handleMenuClick">
          <template v-for="folder in folders">
            <a-menu-item :key="folder.fid">
              <a-icon :type="selectedKeys[0] !== folder.fid?'folder':'folder-open'" />
              <span>{{ folder.name }}</span>
              <a-icon
                type="edit"
                style="right: 0;position: absolute; top: 35%"
                v-if="!collapsed && selectedKeys[0] === folder.fid"
                @click="() => {$message.info('只是一个DEMO') }"
              />
            </a-menu-item>
          </template>
        </a-menu>
      </div>
    </a-layout-sider>

    <a-layout>
      <a-layout-sider
        class="article-list-wrapper"
        :style="[{maxWidth : articleListWidth + 'px'},{minWidth : articleListWidth + 'px'},{backgroundColor:'white'},{width : articleListWidth + 'px'}]"
        @collapse="handleCollapsed"
        v-model="collapsed"
      >
        <div class="article-list-wrapper-btn">
          <a-icon type="file-add" style="font-size: 16px;"/>
          <span :class="!collapsed ? 'article-list-wrapper-text':'article-list-wrapper-text-collapsed'">新建文档</span>
        </div>
        <article-menu-list :collapsed="collapsed" :folder="selectedFolder" @changeSelect="onSelected"/>
      </a-layout-sider>

      <a-layout-content style="margin: 0 0; width: 100% ;height: 100%;max-height: 100%">
        <article-editor class="article-editor" :article="selectedArticle"/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import ArticleMenuList from '@/views/edit/ArticleMenuList'
import ArticleEditor from '@/views/edit/ArticleEditor'
import { getFolders } from '@/api/article'

export default {
  components: {
    ArticleMenuList,
    ArticleEditor
  },
  data () {
    return {
      loading: false,
      collapsed: false,
      addBtnTitle: '新建文件',
      selectedKeys: [],
      mdValue: '',
      folders: [],
      selectedArticle: null,
      selectedFolder: null
    }
  },
  mounted () {
    this.loading = true
    this.getDate(res => {
      this.loading = false
      this.folders = res.result
      this.selectedKeys = [this.folders[0].fid]
      this.selectedFolder = this.folders[0]
    })
  },
  methods: {
    getDate (callback) {
      getFolders().then(res => {
        console.log('getFolders', res)
        callback(res)
      })
    },
    handleCollapsed (collapsed, type) {
      console.log(collapsed, type)
    },
    handleMenuClick (e) {
      console.log(e)
      this.selectedFolder = this.folders.filter(f => String(f.fid) === e.key)[0]
    },
    onSelected (item) {
      if (item) {
        this.selectedArticle = item
      }
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

.menu-wrapper{
  position: fixed;
  left: 0;
  overflow-y: scroll;
  height: 72vh;
  width: 200px;
  &::-webkit-scrollbar {
    width: 0;
  }
}

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
    height: 70px;
    background-color: white;
    color: #434343;
    cursor: pointer;
    font-weight: 400;
    font-size: 18px;
    border-bottom: 1px solid color(~`colorPalette('#ffffff', 5) `);

    &:hover{
      background-color: color(~`colorPalette('#ffffff', 5) `);
      color: #141414;
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

.article-editor{
  max-height: 100vh;
  overflow: hidden;
}
</style>
