<template>
  <a-spin :spinning="spinning" class="editor-wrapper">
    <a-layout class="editor-wrapper">
      <a-layout-header class="editor-header">
        <a-input
          class="editor-title"
          v-model="markdownForm.title"
          size="large">
          <a-icon slot="addonAfter" type="delete" @click="handleDeleteArticle" />
          <a-icon slot="addonAfter" type="menu-unfold" @click="openInfoDrawer"/>
        </a-input>
      </a-layout-header>
      <a-layout-content>
        <mavon-editor
          class="editor-md"
          ref="md"
          @save="save"
          @imgAdd="imgAdd"
          @imgDel="imgDel"
          @change="editorChange"
          v-model="markdownForm.contentMarkdown"
          :imageFilter="imgFilter"
          :codeStyle="markdown.codeStyle"
          :toolbars="markdown.toolbars"
          :toolbarsBackground="markdown.toolbarsBackground"
          :editorBackground="markdown.editorBackground"
          :ishljs="true"
          :style="{backgroundColor: markdown.editorBackground}"
          :previewBackground="markdown.previewBackground"
        />
      </a-layout-content>
      <article-status-drawer ref="aStatus" :article="article" :folders="folders" @update="handleArticleUpdate"/>
    </a-layout>
    <a-modal
      title="删除文章"
      :visible="showDeleteDialog"
      :confirm-loading="deleteLoading"
      ok-text="删除"
      :mask-closable="false"
      :closable="false"
      @ok="deleteArticleSure"
      @cancel="()=>{this.showDeleteDialog=false}"
    >
      <p>是否确定删除文章，本操作执行后不可恢复！</p>
    </a-modal>
  </a-spin>
</template>

<script>
import { uploadImg } from '@/api/articleImg'
import { saveArticle, getArticleContent, deleteArticle } from '@/api/article'
import defaultSettings from '@/config/defaultSettings'
import ArticleStatusDrawer from '@/views/edit/ArticleStatusDrawer'

const defaultTitle = '请输入标题...'
export default {
  components: {
    ArticleStatusDrawer
  },
  props: {
    article: {
     type: Object,
     default: null
    },
    folders: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      spinning: true,
      deleteLoading: false,
      showDeleteDialog: false,
      markdown: {
        codeStyle: 'atom-one-dark',
        editorBackground: '#fafafa',
        toolbarsBackground: defaultSettings.primaryColor,
        previewBackground: '#fafafa',
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          navigation: true, // 导航目录
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          subfield: true, // 单双栏模式
          preview: false // 预览
        }
      },
      markdownForm: {
        articleId: null,
        folderId: null,
        title: defaultTitle,
        contentMarkdown: '',
        contentHtml: '',
        type: 0
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 80, message: '长度在1到80个字符', trigger: 'blur' }
        ]
      },
      lastSaveTime: null,
      timer: null
    }
  },
  mounted () {
    // 暂停自动保存
    // this.timer = setInterval(this.intervalSave, 2 * 60 * 1000)
  },
  beforeDestroy () {
    // clearInterval(this.timer)
  },
  watch: {
    article (val) {
      this.markdownForm.articleId = null
      this.markdownForm.contentMarkdown = ''
      this.markdownForm.title = defaultTitle
      if (val) {
        this.getContent(val.tid)
      } else {
        this.spinning = true
      }
    }
  },
  methods: {
    getContent (tid) {
      this.spinning = true
      getArticleContent({
        tid: tid
      }).then(res => {
        if (res.head.respCode === 200) {
          const { tid, title, content } = res.result
          this.markdownForm.articleId = tid
          this.markdownForm.title = title
          this.markdownForm.contentMarkdown = content
        } else {
          this.$message.error(res.head.respMsg)
        }
        this.spinning = false
      }).catch(e => {
        console.log(e)
        this.spinning = false
      })
    },
    save (value, render, auto = false) { // 保存文章内容
      const param = {
        tid: this.markdownForm.articleId,
        title: this.markdownForm.title,
        contentMd: this.markdownForm.contentMarkdown,
        contentHtml: this.markdownForm.contentHtml
      }
      saveArticle(param).then(res => {
        if (res.head && res.head.respCode === 200) {
          this.$message.success(auto ? '自动保存成功' : '保存成功')
          const resultA = res.result.article
          this.markdownForm.articleId = resultA.tid
          this.handleArticleUpdate(resultA, resultA.fid)
          this.lastSaveTime = new Date()
        } else {
          this.$message.error(res.head.respMsg)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    intervalSave () { // 自动保存
      const now = new Date()
      if (now - this.lastSaveTime >= 2 * 60 * 1000) {
        this.save('', '', true)
      }
    },
    imgFilter (file) {
      console.log(file)
      try {
        const ext = file.name.split('.').pop().toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
      } catch (e) {
        console.log(e)
        return false
      }
    },
    imgAdd (pos, file) { // 添加图片，pos为位置
      const $vm = this.$refs.md
      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then(res => {
        if (res.head && res.head.respCode === 200) {
          $vm.$img2Url(pos, res.result.url)
        } else {
          this.$message.error(res.head.respMsg)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    imgDel (pos, url) { // 删除图片，并不是修改就会触发，仅支持工具栏操作
      console.log(pos)
      console.log(url)
    },
    editorChange (value, render) {
      this.markdownForm.contentHtml = render
    },
    handleDeleteArticle () {
      this.showDeleteDialog = true
    },
    deleteArticleSure () {
      if (!this.article || !this.article.tid) {
        this.$message.error('参数异常！')
        this.showDeleteDialog = false
        return
      }
      this.deleteLoading = true
      deleteArticle({
        tid: this.article.tid
      }).then(res => {
        if (res.head.respCode === 200) {
          this.$emit('delete', true)
        } else {
          this.$message.error(res.head.respMsg)
        }
        this.deleteLoading = false
        this.showDeleteDialog = false
      }).catch(e => {
        console.log(e)
        this.$message.error('删除失败！')
        this.deleteLoading = false
        this.showDeleteDialog = false
      })
    },
    openInfoDrawer () {
      this.$refs.aStatus.openInfoDrawer()
    },
    handleArticleUpdate (newArticle, folderId) {
      this.$emit('update', newArticle, folderId)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.editor-wrapper{
  width: 100%;
  height: 100vh;

  /deep/ .ant-spin{
    max-height: 100%;
  }

  .editor-header{
    height: auto;
    line-height: normal;
    padding: 0 0;
    .editor-title{
      /deep/ [type=text][class~=ant-input] {
        border-color: transparent;
        border-radius: 0;
        background-color: #fafafa;
      }
    }
    /deep/ .ant-input-group-addon{
      border-color: transparent;
      border-radius: 0;
      background-color: #fafafa;
      font-size: 18px;
      i{
        margin-right: 20px;
        cursor: pointer;
      }
      i:hover{
        color: @primary-color;
      }
    }
  }

  .editor-md{
    z-index: 100;
    height: 100%;

    //覆盖MD工具栏的样式
    /deep/ .v-note-op{
      border-radius: 0 0 0 0;
    }
    @icon-color: #fafafa;
    @icon-color-hover: #262626;
    /deep/ [type=button]{
      color: @icon-color !important;
    }
    /deep/ [class~=selected]{
      color: @icon-color-hover !important;
    }
    /deep/ .op-icon:hover{
      color: @icon-color-hover !important;
    }
  }
}
</style>
