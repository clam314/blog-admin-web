<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="list"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ getDesc(index).description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ getDesc(index).value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>
  </a-list>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      list: [
        { title: '账户密码', actions: { title: '修改', callback: () => { this.$message.info('该功能未开放') } } },
        { title: '密保手机', actions: { title: '修改', callback: () => { this.$message.info('该功能未开放') } } },
        { title: '密保问题', actions: { title: '设置', callback: () => { this.$message.info('该功能未开放') } } },
        { title: '备用邮箱', actions: { title: '修改', callback: () => { this.$message.info('该功能未开放') } } },
        { title: 'MFA设备', actions: { title: '绑定', callback: () => { this.$message.info('该功能未开放') } } }
    ] }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    getDesc (index) {
      if (index === 0) {
        return { description: '当前密码强度: ', value: '强' }
      } else if (index === 1) {
        const tel = this.userInfo.telephone
        if (tel) {
          return { description: '已绑定手机: ', value: String(tel).replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2') }
        } else {
          return { description: '未绑定手机', value: '' }
        }
      } else if (index === 2) {
        return { description: '未设置密保问题，密保问题可有效保护账户安全', value: '' }
      } else if (index === 3) {
        const email = this.userInfo.email
        if (email) {
          return { description: '已绑定邮箱: ', value: email.replace(email.substring(2, email.lastIndexOf('@')), '****') }
        } else {
          return { description: '未绑定邮箱', value: '' }
        }
      } else if (index === 4) {
        return { description: '未绑定 MFA 设备，绑定后，可以进行二次确认', value: '' }
      } else {
        return { description: '', value: '' }
      }
    }
  }
}
</script>

<style scoped>

</style>
