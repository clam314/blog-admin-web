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
        @click="() => {this.folderBtnVisible = true;this.folderForm.folderName=''}"
      >
        {{ collapsed?'':'新建文件夹' }}
      </a-button>
      <a-spin :spinning="loading" class="menu-wrapper">
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
      </a-spin>
    </a-layout-sider>

    <a-layout>
      <a-layout-sider
        class="article-list-wrapper"
        :style="[{maxWidth : articleListWidth + 'px'},{minWidth : articleListWidth + 'px'},{backgroundColor:'white'},{width : articleListWidth + 'px'}]"
        @collapse="handleCollapsed"
        v-model="collapsedArticleList"
      >
        <div class="article-list-wrapper-btn" @click="handleNewArticleClick">
          <a-icon type="file-add" style="font-size: 16px;"/>
          <span :class="!collapsedArticleList ? 'article-list-wrapper-text':'article-list-wrapper-text-collapsed'">新建文档</span>
        </div>
        <article-menu-list :collapsed="collapsedArticleList" :folder="selectedFolder" @changeSelect="onSelected"/>
      </a-layout-sider>

      <a-layout-content style="margin: 0 0; width: 100% ;height: 100%;max-height: 100%">
        <article-editor class="article-editor" :article="selectedArticle" :folders="folders"/>
      </a-layout-content>
    </a-layout>
    <a-modal
      v-model="folderBtnVisible"
      :title="addBtnTitle"
      centered
      :confirm-loading="confirmLoading"
      :closable="false"
      @ok="handleOK"
    >
      <a-form-model ref="folderForm" :rules="folderRules" :model="folderForm">
        <a-form-model-item label="文件夹名称" prop="folderName">
          <a-input v-model="folderForm.folderName" placeholder="请输入文件夹名称" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      v-model="articleBtnVisible"
      title="新建文档"
      centered
      :confirm-loading="confirmLoading"
      :closable="false"
      @ok="handleOK"
    >
      <a-form-model ref="folderForm" :rules="articleRules" :model="articleForm">
        <a-form-model-item label="文档名称" prop="articleTitle">
          <a-input v-model="articleForm.articleTitle" placeholder="请输入文档名称" />
        </a-form-model-item>
        <a-form-model-item label="文档介绍" prop="articleDescription">
          <a-input v-model="articleForm.articleDescription" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-layout>
</template>

<script>import ArticleMenuList from '@/views/edit/ArticleMenuList'
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
      collapsedArticleList: false,
      folderBtnVisible: false,
      articleBtnVisible: false,
      addBtnTitle: '新建文件',
      selectedKeys: [],
      mdValue: '',
      folders: [],
      selectedArticle: null,
      selectedFolder: null,
      confirmLoading: false,
      folderRules: {
        folderName: { required: true, message: '文件夹名称不能为空', trigger: 'blur' }
      },
      folderForm: {
        folderName: ''
      },
      articleRules: {
        articleTitle: { required: true, message: '文档名称不能为空', trigger: 'blur' },
        articleDescription: [{ max: 200, message: '简单描述文章内容，请输入200字以内。', trigger: 'blur' }]
      },
      articleForm: {
        articleTitle: '',
        articleDescription: ''
      }
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
      }).catch(e => {
        console.log('getFolders', e)
        this.loading = false
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
    },
    handleNewArticleClick () {
      if (this.selectedFolder === null) {
        this.$message.error('请先选择文件夹！', 1)
      } else {
        this.articleForm.articleTitle = ''
        this.articleForm.articleDescription = ''
        this.articleBtnVisible = true
      }
    },
    handleOK (e) {
      this.$refs['folderForm'].validate(valid => {
        if (valid) {
          this.confirmLoading = true
          setTimeout(() => {
            this.confirmLoading = false
            this.folderBtnVisible = false
          }, 5000)
        } else {
          return false
        }
      })
    }
  },
  computed: {
    articleListWidth () {
      return this.collapsedArticleList ? 120 : 300
    }
  },
  watch: {
    collapsed (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.collapsedArticleList = this.collapsed
        // setTimeout(() => {
        //   this.collapsedArticleList = this.collapsed
        // }, 300)
      }
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
