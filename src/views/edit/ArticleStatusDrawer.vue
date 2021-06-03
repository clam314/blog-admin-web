<template>
  <a-drawer
    width="400"
    placement="right"
    :closable="false"
    :visible="drawerVisible"
    @close="closeInfoDrawer"
  >
    <a-row type="flex" justify="start" align="middle" class="article-header">
      <a-col>
        <a-icon type="setting" style="font-size: 16px;"/>
      </a-col>
      <a-col>
        <span style="padding-left: 10px">文档管理</span>
      </a-col>
    </a-row>

    <a-divider orientation="left">
      封面
    </a-divider>
    <div class="ant-upload-preview" @click="$refs.modal.edit(info.tid)" >
      <a-icon type="file-image" class="upload-icon"/>
      <div class="mask">
        <a-icon type="plus" />
      </div>
      <img :src="des_image" :onerror="`this.src='${require('@/assets/background.svg')}'`"/>
    </div>
    <image-modal ref="modal" @ok="setDesImage"/>
    <!-- 状态设置项 -->
    <a-divider orientation="left">
      状态
    </a-divider>
    <a-spin :spinning="loadingForm" >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="文件夹" prop="folderId">
          <a-select v-model="form.folderId" placeholder="请选择所属文件夹">
            <template v-for="folder in folderList">
              <a-select-option :key="folder.fid">
                {{ folder.name }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="发布中" prop="publish">
          <a-switch v-model="form.publish" />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <a-checkbox-group v-model="form.status" >
            <a-checkbox :value="statusKeys[0]">
              私密
            </a-checkbox>
            <a-checkbox :value="statusKeys[1]">
              置顶
            </a-checkbox>
            <a-checkbox :value="statusKeys[2]">
              关闭评论
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item label="简介" prop="desc">
          <a-input v-model="form.desc" type="textarea" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 22, offset: 1 }">
          <a-button type="primary" @click="onSubmit" style="width: 100%">
            提交修改
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <!-- 发布设置项 -->
    <a-divider orientation="left">
      发布于
    </a-divider>
    <a-spin :spinning="loadingPublish">
      <div class="publish-setting">
        <span style="color: #333333">{{ publishTimeShow | momentStr('未发布','YYYY年MM月DD日 HH:mm:ss') }}</span>
        <a-button type="primary" icon="cloud-upload" @click="handlePublish">
          发布
        </a-button>
      </div>
    </a-spin>
    <!-- 统计信息项 -->
    <a-divider orientation="left">
      统计
    </a-divider>
    <a-spin :spinning="loadingNum" >
      <a-row type="flex" justify="center">
        <a-col :span="6" :offset="1">
          <a-statistic title="阅读数" :value="info ? info.reads:0">
            <template #suffix>
              <a-icon type="eye" />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-statistic title="点赞数" :value="info ? info.like : 0" >
            <template #suffix>
              <a-icon type="like" />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-statistic title="评论数" :value="info ? info.comments : 0" >
            <template #suffix>
              <a-icon type="sound"/>
            </template>
          </a-statistic>
        </a-col>
      </a-row>
    </a-spin>

    <a-divider orientation="left">
      标签
    </a-divider>
    <div class="account-center-tags" style="padding: 0 10px">
      <a-spin :spinning="loadingTags" >
        <template v-for="(tag, index) in tags" >
          <a-tooltip v-if="tag.length > 20" :key="index +String(tagsKey)" :title="tag">
            <a-tag
              style="margin-bottom: 10px"
              :key="index +String(tagsKey)"
              :closable="true"
              @close="() => handleTagClose(tag)"
            >{{ `${tag.slice(0, 20)}...` }}</a-tag>
          </a-tooltip>
          <a-tag
            v-else
            style="margin-bottom: 10px"
            :key="index +String(tagsKey)"
            :closable="true"
            @close="() => handleTagClose(tag)"
          >{{ tag }}</a-tag>
        </template>
        <a-input
          v-if="tagInputVisible"
          ref="tagInput"
          type="text"
          size="small"
          :style="{ width: '78px' }"
          :value="tagInputValue"
          @change="handleInputChange"
          @blur="handleTagInputConfirm"
          @keyup.enter="handleTagInputConfirm"
        />
        <a-tag v-else @click="showTagInput" style="background: #fff; borderStyle: dashed;">
          <a-icon type="plus"/>New Tag
        </a-tag>
      </a-spin>
    </div>
  </a-drawer>
</template>
<script>
import { updateArticleInfo, updateArticleTags, getBasicInfo, publishArticle } from '@/api/article'
import Vue from 'vue'
import { FormModel } from 'ant-design-vue'
import TagSelectOption from '@/components/TagSelect/TagSelectOption'
import ImageModal from '@/views/edit/ImageModal'

Vue.use(FormModel)

export default {
  components: { TagSelectOption, ImageModal },
  data () {
    return {
      drawerVisible: false,
      loadingForm: true,
      loadingNum: true,
      loadingPublish: true,
      loadingTags: true,

      labelCol: { span: 4, offset: 0 },
      wrapperCol: { span: 18, offset: 1 },

      statusKeys: ['private', 'isTop', 'converse'],

      form: {
        folderId: '',
        publish: false,
        status: [],
        desc: ''
      },
      rules: {
        folder: [{ required: true, message: '请选择移动到的文件夹', trigger: 'change' }],
        status: [{ type: 'array', message: '请勾选', trigger: 'change' }],
        desc: [{ max: 200, message: '简单描述文章内容，请输入200字以内。', trigger: 'blur' }]
      },

      tagsKey: 0,
      tags: [],
      tagInputVisible: false,
      tagInputValue: '',

      info: {
        tid: '',
        fid: '',
        title: '',
        content: '',
        reads: 0,
        like: 0,
        comments: 0,
        publishedTime: ''
      },
      folderList: [],
      title: '',
      content: '',
      publishedTime: '',
      des_image: ''
    }
  },
  computed: {
    publishTimeShow () {
      if (this.publishedTime !== '') {
        return Number(this.publishedTime)
      } else {
        return ''
      }
    }
  },
  methods: {
    setLoading (reset = false) {
      this.loadingForm = reset
      this.loadingPublish = reset
      this.loadingTags = reset
      this.loadingNum = reset
    },
    closeInfoDrawer () {
      this.drawerVisible = false
    },
    openInfoDrawer (tid, title, content, folders) {
      this.drawerVisible = true
      this.title = title || ''
      this.content = content || ''
      this.publishedTime = ''
      this.folderList = folders || []
      // 初始化信息
      this.form.publish = false
      this.form.desc = ''
      this.form.folderId = ''
      this.info = null
      this.tags = []
      this.form.status = []
      // 获取信息
      this.getInfo(tid)
    },
    getInfo (tid) {
      this.setLoading(true)
      if (!tid) {
        return
      }
      getBasicInfo({
        tid
      }).then(res => {
        if (res.head.respCode === 200) {
          const article = res.result
          this.form.publish = Boolean(article.published)
          this.form.desc = article.description || ''
          this.form.folderId = article.fid
          this.info = {}
          this.info.tid = article.tid
          this.info.fid = article.fid
          this.info.reads = article.reads
          this.info.like = article.like
          this.info.comments = article.comments
          this.publishedTime = article.publishedTime
          this.des_image = article.des_image
          this.tags = article.tags
          this.form.status = [];
          [0, 1, 2].forEach(i => {
            if (article[this.statusKeys[i]]) {
              this.form.status.push(this.statusKeys[i])
            }
          })
        } else {
          this.$message.error(res.head.respMsg)
        }
        this.setLoading(false)
      }).catch(e => {
        console.log(e)
        this.$message.error('获取文章基本信息失败！')
        this.setLoading(false)
      })
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (!this.info) {
          this.$message.error('参数异常，更新信息失败！')
          return
        }
        if (valid) {
          const param = {
            tid: this.info.tid,
            fid: this.info.fid,
            newFid: this.form.folderId,
            published: this.form.publish ? 1 : 0,
            status: this.form.status,
            description: this.form.desc
          }
          this.loadingForm = true
          const oldFid = this.info.fid
          updateArticleInfo(param).then(res => {
            if (res.head && res.head.respCode === 200) {
              this.drawerVisible = oldFid === res.result.fid
              this.$emit('update', {
                tid: res.result.tid,
                fid: res.result.fid,
                published: res.result.published,
                description: res.result.description,
                updateTime: res.result.updateTime
              })
            } else {
              this.$message.error(res.head.respMsg)
            }
            this.loadingForm = false
          }).catch(e => {
            this.loadingForm = false
          })
        } else {
          return false
        }
      })
    },
    handleTagClose (removeTag) {
      this.updateTags(this.info.tid, removeTag, true, (rTag) => {
        this.tags = this.tags.filter(tag => tag !== rTag)
        this.info.tags = this.tags
      }, () => {
        this.tagsKey = new Date().getTime() // 标签关闭在网络请求前，失败后需要重新显示
      })
    },
    showTagInput () {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput.focus()
      })
    },
    handleInputChange (e) {
      this.tagInputValue = e.target.value
    },
    handleTagInputConfirm () {
      const reset = () => {
        this.tagInputVisible = false
        this.tagInputValue = ''
      }
      if (this.tagInputValue && !this.tags.includes(this.tagInputValue)) {
        this.updateTags(this.info.tid, this.tagInputValue, false, (newTag) => {
          this.tags = [...this.tags, newTag]
        }, reset)
      } else {
        reset()
      }
    },
    updateTags (tid, tag, isDelete, callback, reset = () => {}) {
      if (!tid || !tag || tag === '') {
        reset()
        return
      }
      this.tagsSpinning = true
      updateArticleTags({ tid, tag, isDelete }).then(res => {
        this.tagsSpinning = false
        if (res.head && res.head.respCode === 200) {
          callback(tag, isDelete)
        } else {
          this.$message.error(res.head.respMsg)
        }
        reset()
      }).catch(e => {
        reset()
        this.tagsSpinning = false
        this.$message.error('更新标签，请刷新页面或稍后重试！')
      })
    },
    handlePublish () {
      if (!this.info || !this.title || !this.content) {
        this.$message.error('参数异常，发布文章失败！')
        return
      }
      this.loadingPublish = true
      publishArticle({
        tid: this.info.tid,
        title: this.title,
        content: this.content
      }).then(res => {
        if (res.head.respCode === 200) {
          this.publishedTime = res.result.publishedTime
          this.form.publish = res.result.published
          this.$emit('update', { tid: res.result.tid, publishedTime: res.result.publishedTime, published: 1 })
        } else {
          this.$message.error(res.head.respMsg)
        }
        this.loadingPublish = false
      }).catch(e => {
        console.log(e)
        this.$message.error('发布文章失败！')
        this.loadingPublish = false
      })
    },
    setDesImage (url) {
      this.des_image = url
    }
  }
}
</script>
<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.article-header{
  i,span{
    font-size: 18px !important;
    color: @primary-color !important;
  }
}

.article-content-status{
  margin-top: 15px;
}

.publish-setting {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
}

@upload-height:200px;
.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  border-radius: 5px;
  border: 1px solid rgba(0,0,0,0.2);
  min-height: @upload-height;

  .upload-icon {
    position: absolute;
    top: 0.5em;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0,0,0,0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img, .mask {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
  }
}

</style>
