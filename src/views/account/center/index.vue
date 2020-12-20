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
            <div class="bio">海纳百川，有容乃大</div>
          </div>
          <div class="account-center-detail">
            <p>
              <i class="title"></i>交互专家
            </p>
            <p>
              <i class="group"></i>蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED
            </p>
            <p>
              <i class="address"></i>
              <span>浙江省</span>
              <span>杭州市</span>
            </p>
          </div>
          <a-divider/>

          <div class="account-center-tags">
            <div class="tagsTitle">标签</div>
            <a-spin :spinning="tagsSpinning">
              <template v-for="(tag, index) in tags">
                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                  <a-tag
                    :key="tag"
                    :closable="index !== 0"
                    :close="() => handleTagClose(tag)"
                  >{{ `${tag.slice(0, 20)}...` }}</a-tag>
                </a-tooltip>
                <a-tag
                  v-else
                  :key="tag"
                  :closable="index !== 0"
                  :close="() => handleTagClose(tag)"
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
      tags: [],
      tagsSpinning: true,

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
    ...mapGetters(['nickname', 'avatar'])
  },
  mounted () {
    this.getTags()
  },
  methods: {
    getTags () {
      this.$http.get('/api/user/tags').then(res => {
        console.log(res)
        this.tags = res.result
        this.tagsSpinning = false
      })
    },

    handleTabChange (key, type) {
      this[type] = key
    },

    handleTagClose (removeTag) {
      this.tags = this.tags.filter(tag => tag !== removeTag)
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
      const inputValue = this.tagInputValue
      let tags = this.tags
      if (inputValue && !tags.includes(inputValue)) {
        tags = [...tags, inputValue]
      }

      Object.assign(this, {
        tags,
        tagInputVisible: false,
        tagInputValue: ''
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
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
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
      background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);
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
