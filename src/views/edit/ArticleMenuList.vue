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
      :split="false"
      class="list"
    >
      <a-list-item
        slot="renderItem"
        slot-scope="item"
        class="list-item"
        :class="{'list-item-selected' : item===selectedItem}"
        @click="() => {onSelectChange(item)}">
        <div class="list-item-content" >
          <a-list-item-meta>
            <a slot="title" class="list-title">{{ ellipsis(item.title,25) }}</a>
            <a-avatar
              class="list-icon"
              slot="avatar"
              shape="square"
              :icon="fileIcon(item.content)"
            />
            <div slot="description" class="list-description" :class="!collapsed? 'list-description-normal' : 'list-description-collapsed'">
              {{ ellipsis(item.description,14) }}
            </div>
          </a-list-item-meta>
        </div>
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
    },
    folder: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      busy: false,
      selectedItem: null,
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
      if (res.result) {
        this.data = res.result
        this.onSelectChange(this.data[0])
      }
    })
  },
  watch: {
    folder (val) {
      if (val) {
        console.log(val)
        this.loading = false
        this.busy = false
        this.data = []
        this.getData(res => {
          this.loading = false
          this.busy = false
          if (res.result) {
            this.data = res.result
            this.onSelectChange(this.data[0])
          }
        })
      }
    }
  },
  methods: {
    getData (callback) {
      this.$http.get('/list/articles').then(res => {
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
    onSelectChange (item) {
      this.selectedItem = item
      this.$emit('changeSelect', item)
    },
    fileIcon (filePath) {
      return getFileTypeForIcon(filePath)
    },
    ellipsis (str, limit) {
      if (str.length > limit) {
        return str.slice(0, limit) + '……'
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
    max-height: 85px;
    cursor: pointer;
    background-color: transparent;
    transition: background-color .3s @ease-in-out;
    &:after{
      border-right: 3px solid  @primary-color;
      content: '';
      height: 84px;
      -webkit-transform: scaleY(.0001);
      transform: scaleY(.0001);
      opacity: 0;
      transition: transform .3s @ease-in-out,opacity .3s @ease-in-out,-webkit-transform .3s @ease-in-out;
    }

    &-content{
      padding: 0 15px;
    }

    &-selected{
      background-color: #fafafa;
      transition: background-color .3s @ease-in-out;
    }

    &-selected:after{
      -webkit-transform: scaleY(1);
      transform: scaleY(1);
      opacity: 1;
      transition: transform .3s @ease-in-out,opacity .3s @ease-in-out,-webkit-transform .3s @ease-in-out;
    }
  }

  .list-title{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-description {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &-normal{
      opacity: 1;
      height: auto;
      transition: opacity 0.3s @ease-in-out, height 0.3s @ease-in-out;
    }

    &-collapsed{
      opacity: 0;
      height: 0;
      transition: opacity 0.3s @ease-in-out, height 0.3s @ease-in-out;
    }
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
