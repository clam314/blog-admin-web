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
      状态设置
    </a-divider>

    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="文件夹" prop="region">
        <a-select v-model="form.region" placeholder="please select your zone">
          <a-select-option value="shanghai">
            Zone one
          </a-select-option>
          <a-select-option value="beijing">
            Zone two
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="发布" prop="delivery">
        <a-switch v-model="form.delivery" />
      </a-form-model-item>
      <a-form-model-item label="状态" prop="type">
        <a-checkbox-group v-model="form.type">
          <a-checkbox value="1" name="type">
            私密
          </a-checkbox>
          <a-checkbox value="2" name="type">
            置顶
          </a-checkbox>
          <a-checkbox value="3" name="type">
            关闭评论
          </a-checkbox>
        </a-checkbox-group>
      </a-form-model-item>
      <a-form-model-item label="简介" prop="desc">
        <a-input v-model="form.desc" type="textarea" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 2 }">
        <a-button type="primary" @click="onSubmit" style="width: 100%">
          提交修改
        </a-button>
      </a-form-model-item>
    </a-form-model>

    <!-- 统计信息项 -->
    <a-divider orientation="left">
      统计
    </a-divider>
    <a-row >
      <a-col :span="4" :offset="3">
        <a-statistic title="阅读数" :value="0">
          <template #suffix>
            <a-icon type="eye" />
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="4" :offset="3">
        <a-statistic title="点赞数" :value="0" >
          <template #suffix>
            <a-icon type="like" />
          </template>
        </a-statistic>
      </a-col>
      <a-col :span="4" :offset="3">
        <a-statistic title="评论数" :value="0" >
          <template #suffix>
            <a-icon type="sound"/>
          </template>
        </a-statistic>
      </a-col>
    </a-row>
  </a-drawer>
</template>
<script>
import Vue from 'vue'
import { FormModel } from 'ant-design-vue'
Vue.use(FormModel)

export default {
  props: {
    article: {
      type: Object,
      default: null
    },
    folders: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      drawerVisible: true,
      statusTop: this.article ? this.article.sort : 0, // 0-不置顶，1-3越大优先级越高,
      labelCol: { span: 4, offset: 0 },
      wrapperCol: { span: 18, offset: 1 },
      other: '',
      form: {
        folder: '',
        sort: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
        ],
        region: [{ required: false, message: 'Please select Activity zone', trigger: 'change' }],
        date1: [{ required: true, message: 'Please pick a date', trigger: 'change' }],
        type: [
          {
            type: 'array',
            message: 'Please select at least one activity type',
            trigger: 'change'
          }
        ],
        resource: [
          { required: true, message: 'Please select activity resource', trigger: 'change' }
        ],
        desc: [{ required: false, message: 'Please input activity form', trigger: 'blur' }]
      }
    }
  },
  computed: {
    defaultFolder () {
      for (const folder in this.folders) {
        if (folder.fid === this.article.fid) {
          return folder
        }
      }
      return ''
    }
  },
  methods: {
    closeInfoDrawer () {
      this.drawerVisible = false
    },
    openInfoDrawer () {
      this.drawerVisible = true
    },
    handleChangeFolders (value, option) {
      console.log(value, option)
    },
    handleChangeTop (e) {
      this.statusTop = e.target.value
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
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
