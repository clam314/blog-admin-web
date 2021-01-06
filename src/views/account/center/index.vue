<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <img :src="avatar">
            </div>
            <div class="username">{{ nickname }}</div>
            <div class="bio" v-if="userInfo.introduction">{{ userInfo.introduction }}</div>
          </div>
          <div class="account-center-detail">
            <p v-if="userInfo.email">
              <a-icon type="mail"/>{{ userInfo.email }}
            </p>
            <p v-if="userInfo.lastLoginIp">
              <a-icon type="global"/>{{ userInfo.lastLoginIp }}
            </p>
            <p v-if="userInfo.lastLoginTime">
              <a-icon type="history"/>{{ Number(userInfo.lastLoginTime) | moment }}
            </p>
          </div>
          <a-divider/>

          <div class="account-center-tags">
            <div class="tagsTitle">标签</div>
            <a-spin :spinning="tagsSpinning">
              <template v-for="tag in tags">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                  <a-tag
                    :key="tag"
                    :closable="true"
                    @close="() => handleTagClose(tag)"
                  >{{ `${tag.slice(0, 20)}...` }}</a-tag>
                </a-tooltip>
                <a-tag
                  v-else
                  :key="tag"
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
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="key => handleTabChange(key, 'noTitleKey')"
        >
          <basic-setting v-if="noTitleKey === 'setting'"></basic-setting>
          <security v-else-if="noTitleKey === 'security'"></security>
          <custom v-else-if="noTitleKey === 'custom'"></custom>
          <binding v-else-if="noTitleKey === 'binding'"></binding>
          <notification v-else-if="noTitleKey === 'notification'"></notification>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import { BasicSetting, Binding, Custom, Notification, Security } from './page'
import { updateUserTags } from '@/api/user'
import { mapGetters } from 'vuex'

export default {
  components: {
    RouteView,
    PageView,
    BasicSetting,
    Security,
    Custom,
    Binding,
    Notification
  },
  data () {
    return {
      tagsSpinning: false,
      tagInputVisible: false,
      tagInputValue: '',
      tabListNoTitle: [
        {
          key: 'setting',
          tab: '基本设置'
        },
        {
          key: 'security',
          tab: '安全设置'
        },
        {
          key: 'custom',
          tab: '个性化'
        },
        {
          key: 'binding',
          tab: '账号绑定'
        },
        {
          key: 'notification',
          tab: '新消息通知'
        }
      ],
      noTitleKey: 'setting'
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    tags: {
      get () {
        return this.$store.getters.tags
      },
      set (val) {
        this.$store.commit('SET_TAGS', val)
      }
    }
  },
  mounted () {
  },
  methods: {
    handleTabChange (key, type) {
      this[type] = key
    },

    handleTagClose (removeTag) {
     this.updateTags(removeTag, true, (rTag) => {
        this.tags = this.tags.filter(tag => tag !== rTag)
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
        this.updateTags(this.tagInputValue, false, (newTag) => {
          this.tags = [...this.tags, newTag]
        }, reset)
      } else {
        reset()
      }
    },
    updateTags (tag, isDelete, callback, reset = () => {}) {
      if (!tag || tag === '') {
        reset()
        return
      }
      this.tagsSpinning = true
      updateUserTags({ tag, isDelete }).then(res => {
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
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      width: 104px;
      height: 104px;
      margin: 0 auto 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .tagsTitle{
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>
