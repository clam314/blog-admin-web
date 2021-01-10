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

    <!-- 状态设置项 -->
    <a-divider orientation="left">
      状态
    </a-divider>
    <a-spin :spinning="preparingForm" >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="文件夹" prop="folderId">
          <a-select v-model="form.folderId" placeholder="请选择所属文件夹">
            <template v-for="folder in folders">
              <a-select-option :key="folder.fid">
                {{ folder.name }}
              </a-select-option>
            </template>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="发布" prop="publish">
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
    <!-- 统计信息项 -->
    <a-divider orientation="left">
      统计
    </a-divider>
    <a-spin :spinning="preparingStatistics" >
      <a-row type="flex" justify="center">
        <a-col :span="6" :offset="1">
          <a-statistic title="阅读数" :value="article ? article.reads : 0">
            <template #suffix>
              <a-icon type="eye" />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-statistic title="点赞数" :value="article ? article.like : 0" >
            <template #suffix>
              <a-icon type="like" />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="6" :offset="1">
          <a-statistic title="评论数" :value="article ? article.comments : 0" >
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
      <a-spin :spinning="tagsSpinning" >
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
import { updateArticleInfo, updateArticleTags } from '@/api/article'
import Vue from 'vue'
import { FormModel } from 'ant-design-vue'
import TagSelectOption from '@/components/TagSelect/TagSelectOption'

Vue.use(FormModel)

export default {
  components: { TagSelectOption },
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
      drawerVisible: false,
      preparingForm: true,
      preparingStatistics: true,

      labelCol: { span: 4, offset: 0 },
      wrapperCol: { span: 18, offset: 1 },

      statusKeys: ['private', 'isTop', 'converse'],

      form: {
        folderId: '',
        publish: false,
        status: ['private'],
        desc: ''
      },
      rules: {
        folder: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
        status: [
          {
            type: 'array',
            message: 'Please select at least one activity type',
            trigger: 'change'
          }
        ],
        desc: [{ max: 200, message: '简单描述文章内容，请输入200字以内。', trigger: 'blur' }]
      },

      tagsKey: 0,
      tags: [],
      tagsSpinning: false,
      tagInputVisible: false,
      tagInputValue: ''
    }
  },
  mounted () {
  },
  watch: {
    article (newVal) {
      if (newVal) {
        this.preparingStatistics = false
        this.form.status = [];
        [0, 1, 2].forEach(i => {
          if (newVal[this.statusKeys[i]]) {
            this.form.status.push(this.statusKeys[i])
          }
        })
        this.tagsSpinning = false
        this.tags = this.article.tags
      }
      this.initData()
    },
    folders () {
      this.initData()
    }
  },
  methods: {
    initData () {
      if (!this.article || !this.folders) {
        return
      }
      this.preparingForm = false
      this.form.publish = Boolean(this.article.published)
      this.form.desc = this.article.description || ''
      this.form.folderId = this.article.fid
    },
    closeInfoDrawer () {
      this.drawerVisible = false
    },
    openInfoDrawer () {
      this.drawerVisible = true
    },

    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const param = {
            tid: this.article.tid,
            fid: this.article.fid,
            newFid: this.form.folderId,
            published: this.form.publish ? 1 : 0,
            status: this.form.status,
            description: this.form.desc
          }
          this.preparingForm = true
          const oldFid = this.article.fid
          updateArticleInfo(param).then(res => {
            if (res.head && res.head.respCode === 200) {
              this.drawerVisible = oldFid === res.result.article.fid
              this.$emit('update', res.result.article, res.result.article.fid)
            } else {
              this.$message.error(res.head.respMsg)
            }
            this.preparingForm = false
          }).catch(e => {
            this.preparingForm = false
          })
        } else {
          return false
        }
      })
    },
    handleTagClose (removeTag) {
      this.updateTags(this.article.tid, removeTag, true, (rTag) => {
        this.tags = this.tags.filter(tag => tag !== rTag)
        this.article.tags = this.tags
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
        this.updateTags(this.article.tid, this.tagInputValue, false, (newTag) => {
          this.tags = [...this.tags, newTag]
          this.article.tags = this.tags
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

</style>
