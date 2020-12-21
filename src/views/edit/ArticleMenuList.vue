<template>
  <div
    v-infinite-scroll="onLoadMore"
    class="demo-infinite-container"
    :infinite-scroll-disabled="busy"
    :infinite-scroll-distance="10"
  >
    <a-list
      :data-source="data"
      item-layout="vertical"
      class="list"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <a slot="actions">edit</a>
        <a slot="actions">more</a>
        <a-list-item-meta :description="collapsed ?'' : item.description.slice(0,40)">
          <a slot="title">{{ collapsed ?item.title.slice(0,20) : item.title }}</a>
          <a-avatar
            slot="avatar"
            shape="square"
            :icon="fileIcon(item.content)"
          />
        </a-list-item-meta>
      </a-list-item>
      <div v-if="true" class="demo-loading-container">
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
      console.log(filePath)
      const type = getFileTypeForIcon(filePath)
      console.log(type)
      return type
    }
  }
}
</script>

<style lang="less" scoped>
.demo-infinite-container {
  overflow: auto;
  height: calc(100vh - 45px);
  padding: 4px 5px 4px 15px;
  &::-webkit-scrollbar {
    width: 0;
  }
}

.demo-loading-container {
  position: relative;
  bottom: 50%;
  width: 100%;
  text-align: center;
}

</style>
