<template>

  <a-modal
    title="修改封面"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="1200"
    :footer="null"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '480px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :output-type="options.outputType"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '48px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :accept="acceptType" :beforeUpload="beforeUpload" :showUploadList="false">
          <a-button icon="upload">选择图片</a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{span: 1, offset: 2}" :md="2">
        <a-button icon="plus" @click="changeScale(1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="minus" @click="changeScale(-1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="undo" @click="rotateLeft"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="redo" @click="rotateRight"/>
      </a-col>
      <a-col :lg="{span: 2, offset: 6}" :md="2">
        <a-button type="primary" @click="finish('blob')">保存</a-button>
      </a-col>
    </a-row>
  </a-modal>

</template>
<script>
import { updateCover } from '@/api/article'

export default {
  data () {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      acceptType: '.jpg, .jpeg, .png, .gif',
      options: {
        img: '',
        outputType: 'png',
        autoCrop: true,
        autoCropWidth: 512,
        autoCropHeight: 384,
        fixedBox: true
      },
      previews: {}
    }
  },
  methods: {
    edit (id) {
      this.visible = true
      this.tid = id
      /* 获取原始头像 */
    },
    close () {
      this.tid = null
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    beforeUpload (file) {
      this.fileName = file.name
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
      }
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      return false
    },

    // 上传图片（点击上传按钮）
    finish (type) {
      console.log('finish')
      const _this = this
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
          formData.append('tid', this.tid)
          formData.append('file', data, this.fileName)
          updateCover(formData).then(res => {
            console.log('upload response:', res)
            if (res.head && res.head.respCode === 200) {
              _this.$message.success('上传成功')
              _this.$emit('ok', res.result.url)
              _this.visible = false
              this.$store.dispatch('GetInfo').catch(e => {
                this.$message.error('获取用户信息失败，请刷新页面或稍后重试！')
              })
            } else {
              this.$message.error(res.head.respMsg)
            }
          })
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    okHandel () {
      const vm = this

      vm.confirmLoading = true
      setTimeout(() => {
        vm.confirmLoading = false
        vm.close()
        vm.$message.success('上传图片成功')
      }, 3000)
    },

    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    margin: 50px auto;
    width: 512px;
    height: 384px;
    border-radius: 5px;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
