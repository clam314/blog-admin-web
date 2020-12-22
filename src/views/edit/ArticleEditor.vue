<template>
  <a-layout class="editor-wrapper">
    <a-layout-header class="editor-header">
      <a-input
        class="editor-title"
        v-model="markdownForm.title"
        size="large">
        <a-icon slot="addonAfter" type="setting" @click="openInfoDrawer"/>
        <a-icon slot="addonAfter" type="delete" @click="deleteArticle" />
      </a-input>
    </a-layout-header>
    <a-layout-content>
      <mavon-editor
        class="editor-md"
        ref="md"
        @save="save"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
        v-model="markdownForm.contentMarkdown"
        :codeStyle="markdown.codeStyle"
        :toolbars="markdown.toolbars"
        :toolbarsBackground="markdown.toolbarsBackground"
        :editorBackground="markdown.editorBackground"
        :style="{backgroundColor: markdown.editorBackground}"
        :previewBackground="markdown.previewBackground"
      />
    </a-layout-content>
    <article-status-drawer ref="aStatus"/>
  </a-layout>
</template>

<script>
import { uploadImg } from '@/api/articleImg'
import { getMarkdownArticle, saveMarkdownArticle } from '@/api/article'
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
    }
  },
  data () {
    return {
      local: true, // true-文档来源是本地，false-来源网络需要请求
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
        title: defaultTitle,
        contentMarkdown: '',
        contentHtml: null,
        type: 0
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 80, message: '长度在1到80个字符', trigger: 'blur' }
        ]
      },
      lastSaveTime: null,
      timer: null,
      infoDrawer: {
        visible: false
      }
    }
  },
  created () {
    if (!this.local) {
      this.getArticle()
    }
  },
  mounted () {
    this.timer = setInterval(this.intervalSave, 2 * 60 * 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  watch: {
    article (val) {
      if (val) {
        const { tid, title, content } = val
        this.markdownForm.articleId = tid
        this.markdownForm.title = title
        this.markdownForm.contentMarkdown = content
      }
    }
  },
  methods: {
    getArticle () { // 获取文章内容
      const id = this.$route.query.a
      if (id == null) {
        this.markdownForm.contentMarkdown = ''
      } else {
        getMarkdownArticle(id).then(r => {
          this.markdownForm.contentMarkdown = r.data.contentMarkdown == null ? '' : r.data.contentMarkdown
          this.markdownForm.articleId = r.data.articleId
          this.markdownForm.title = r.data.title
          this.markdownForm.type = r.data.type
        }).catch(e => {
          console.log(e)
        })
      }
    },
    save () { // 保存文章内容
      saveMarkdownArticle(this.markdownForm).then(r => {
        this.$message.success('保存成功')
        this.markdownForm.articleId = r.data.articleId
        this.lastSaveTime = new Date()
      }).catch(e => {
        console.log(e)
      })
    },
    intervalSave () { // 自动保存
      const now = new Date()
      if (now - this.lastSaveTime >= 2 * 60 * 1000) {
        saveMarkdownArticle(this.markdownForm).then(r => {
          this.$message.success('自动保存成功')
          this.lastSaveTime = new Date()
        }).catch(e => {
          console.log(e)
        })
      }
    },
    imgAdd (pos, file) { // 添加图片，pos为位置
      const markdownImg = {}; const $vm = this.$refs.md
      markdownImg.base64Data = file.miniurl // 获取图片base64内容
      markdownImg.type = file.type
      uploadImg(markdownImg).then(r => {
        console.log(r)
        $vm.$img2Url(pos, process.env.VUE_APP_BASE_API + '/img/' + r.data)
      }).catch(e => {
        console.log(e)
      })
    },
    imgDel (pos, url) { // 删除图片，并不是修改就会触发，仅支持工具栏操作
      console.log(pos)
      console.log(url)
    },
    deleteArticle () {
      if (this.markdownFile) {
        console.log(...this.markdownFile)
      } else {
        this.$message.error('文件信息为空，无法删除！')
      }
    },
    openInfoDrawer () {
      this.$refs.aStatus.openInfoDrawer()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.editor-wrapper{
  width: 100%;
  height: 100%;

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
