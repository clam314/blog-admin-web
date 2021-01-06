<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form-model
          ref="form"
          layout="vertical"
          :rules="rules"
          :model="form"
        >
          <a-form-model-item label="昵称" prop="nickName">
            <a-input placeholder="请输入您的昵称" v-model="form.nickName"/>
          </a-form-model-item>

          <a-form-model-item label="个人简介" prop="introduction">
            <a-textarea rows="4" placeholder="请输入个人简介" v-model="form.introduction"/>
          </a-form-model-item>

          <a-form-model-item label="邮箱" prop="email">
            <a-input placeholder="example@gmail.com" v-model="form.email"/>
          </a-form-model-item>

          <a-form-model-item>
            <a-button type="primary" @click="onSubmit" :loading="submitting">更新基本信息</a-button>
          </a-form-model-item>
        </a-form-model>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setAvatar"/>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { validateEmail } from '@/utils/validate'
import { updateUserInfo } from '@/api/user'
import Vue from 'vue'
import { FormModel } from 'ant-design-vue'
Vue.use(FormModel)

export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      option: {
        img: '/avatar.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      submitting: false,
      form: {
        nickName: '',
        introduction: '',
        email: ''
      },
      rules: {
        nickName: [{ max: 10, message: '请输入10字以内。', trigger: 'change' }],
        introduction: [{ max: 80, message: '请输入80字以内。', trigger: 'change' }],
        email: [{ validator: validateEmail, trigger: 'change' }]
      }
    }
  },
  methods: {
    setAvatar (url) {
      this.option.img = url
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updateInfo(this.form)
        } else {
          return false
        }
      })
    },
    updateInfo (info) {
      this.submitting = true
      updateUserInfo(info).then(res => {
        this.submitting = false
        if (res.head && res.head.respCode === 200) {
          this.$notification.success({
            message: 'success',
            description: `基本信息更新成功！`
          })
          this.$store.dispatch('GetInfo').catch(e => {
            this.$message.error('获取用户信息失败，请刷新页面或稍后重试！')
          })
        } else {
          this.$message.error(res.head.respMsg)
        }
      }).catch(e => {
        this.submitting = false
        this.$notification.error({
          message: 'error',
          description: `基本信息更新失败，请刷新页面或稍后重试！`
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
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
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
