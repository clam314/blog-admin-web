<template>
  <div
    v-infinite-scroll="onLoadMore"
    class="infinite-container"
    :infinite-scroll-disabled="busy"
    :infinite-scroll-distance="10"
  >
    <a-list
      :data-source="data"
      item-layout="horizontal"
      class="list"
    >
      <a-list-item slot="renderItem" slot-scope="item" class="list-item">
        <a-list-item-meta>
          <a slot="title" class="list-title">{{ item.title }}</a>
          <a-avatar
            class="list-icon"
            slot="avatar"
            shape="square"
            :icon="fileIcon(item.content)"
          />
          <div slot="description" :class="!collapsed? 'list-description' : 'list-description-collapsed'">
            {{ ellipsis(item.description,30) }}
          </div>
        </a-list-item-meta>
      </a-list-item>
      <div v-if="true" class="loading-container">
        <a-spin />
      </div>
    </a-list>
  </div>
</template>
<script>
import { getFileTypeForIcon } from '@/utils/util'
import infiniteScroll from 'vue-infinite-scroll'
import defaultSettings from '@/config/defaultSettings'

export default {
  directives: {
    infiniteScroll
  },
  name: 'ArticleMenuList',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      busy: false,
      selectedItem: false,
      iconColor: defaultSettings.primaryColor,
      data: []
    }
  },
  beforeMount () {
    this.busy = true
    this.loading = true
    this.getData(res => {
      this.loading = false
      this.busy = false
      this.data = res.result
    })
  },
  methods: {
    getData (callback) {
      this.$http.get('/list/articleMenuList').then(res => {
        console.log(res)
        callback(res)
      })
    },
    onLoadMore () {
      this.busy = true
      this.loading = true
      this.getData(res => {
        this.data = this.data.concat(res.result)
        this.loading = false
        this.busy = false
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'))
        })
      })
    },
    fileIcon (filePath) {
      return getFileTypeForIcon(filePath)
    },
    ellipsis (str, limit) {
      if (str.length > limit) {
        return str.slice(0, limit) + '...'
      } else {
        return str
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.infinite-container {
  overflow: auto;
  height: calc(100vh - 48px);
  &::-webkit-scrollbar {
    width: 0;
  }

  .list-item{
    max-height: 90px;
    padding: 10px 15px 10px 15px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-align: justify;
    -webkit-line-clamp: 2; //行数
    overflow: hidden;
    text-overflow: clip;
  }

  .list-title{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-description{
    opacity: 1;
    height: 60px;
    transition: opacity 0.3s @ease-in-out, height 0.3s @ease-in-out;
  }

  .list-description-collapsed{
    opacity: 0;
    height: 0;
    transition: opacity 0.3s @ease-in-out, height 0.3s @ease-in-out;
  }

  .list-icon {
    background-color: @primary-color;
  }

  .list-item-selected{
    background-color: rgba(0,0,0,0.1);
  }
}

.loading-container {
  position: relative;
  bottom: 50%;
  width: 100%;
  text-align: center;
}
</style>
