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
        slot-scope="item, index"
        class="list-item"
        :class="{'list-item-selected' : item===selectedItem}"
        @click="() => {onSelectChange(index, item)}">
        <div class="list-item-content" >
          <a-list-item-meta>
            <a slot="title" class="list-title" :class="!collapsed? 'list-title-normal' : 'list-title-collapsed'">{{ item.title }}</a>
            <a-badge slot="avatar">
              <a-icon
                slot="count"
                class="icon-color"
                type="check-circle"
                theme="twoTone"
                twoToneColor="red"
                v-if="item.published"/>
              <a-avatar class="list-icon icon-color" shape="square" :icon="fileIcon('md')" />
            </a-badge>
            <div slot="description" class="list-description" :class="!collapsed? 'list-description-normal' : 'list-description-collapsed'">
              {{ item.description }}
            </div>
          </a-list-item-meta>
        </div>
      </a-list-item>
      <div v-if="loading" class="loading-container">
        <a-spin style="margin-top: 10px"/>
      </div>
      <div v-if="noMore && data.length !== 0" >
        <p style="margin:12px auto;font-size: 14px;font-weight: 400;text-align: center">没有更多了~</p>
      </div>
    </a-list>
  </div>
</template>
<script>
import { getFileTypeForIcon } from '@/utils/util'
import infiniteScroll from 'vue-infinite-scroll'
import defaultSettings from '@/config/defaultSettings'
import { getArticles } from '@/api/article'

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
      noMore: false,
      busy: false,
      pageNum: 0,
      pageCount: 15,
      selectedIndex: 0,
      selectedItem: null,
      iconColor: defaultSettings.primaryColor,
      data: []
    }
  },
  beforeMount () {
    this.resetLoad(true)
  },
  watch: {
    folder (val) {
      if (val) {
        this.firstGetData()
      }
    }
  },
  methods: {
    resetLoad (b) {
      this.loading = b
      this.busy = b
    },
    firstGetData () {
      this.data = []
      this.noMore = false
      this.pageNum = 0
      this.getData(res => {
        if (res.result.list.length > 0) {
          this.data = res.result.list
          this.onSelectChange(0, this.data[0])
        } else {
          this.onSelectChange(0, null)
        }
      })
    },
    getData (callback) {
      this.resetLoad(true)
      const param = {
        fid: this.folder.fid,
        pageNum: this.pageNum,
        pageCount: this.pageCount
      }
      if (this.data.length > 0) {
        param.tid = this.data[this.data.length - 1].tid
      }
      getArticles(param).then(res => {
        if (res.head && res.head.respCode === 200 && Array.isArray(res.result.list)) {
          this.pageNum = res.result.pageNum + 1
          callback(res)
          this.noMore = res.result.total <= this.data.length
        }
        this.resetLoad(false)
      }).catch(e => {
        this.resetLoad(false)
      })
    },
    onLoadMore () {
      if (!this.folder || !this.folder.fid || this.noMore) {
        return
      }
      this.resetLoad(true)
      this.getData(res => {
        if (res.result.list.length > 0) {
          this.data = this.data.concat(res.result.list)
        }
        this.$nextTick(() => window.dispatchEvent(new Event('resize')))
        }
      )
    },
    onSelectChange (index, item) {
      this.selectedIndex = index
      this.selectedItem = item
      this.$emit('changeSelect', item)
    },
    fileIcon (filePath) {
      return getFileTypeForIcon(filePath)
    },
    changeSelectedArticle (newArticle) {
      console.log('changeSelectedArticle')
      this.selectedItem = newArticle
      this.data[this.selectedIndex] = this.selectedItem
    }
  }
}
</script>

<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.infinite-container {
  overflow: auto;
  height: calc(100vh - 70px);
  &::-webkit-scrollbar {
    width: 0;
  }

  @wrapper-width: 300px;
  @wrapper-width-collapsed: 120px;

  @wrapper-padding : 15px;
  @icon-width : 32px;
  @icon-gutter : 16px;
  @wrapper-after-width: 3px;
  .list-item{
    max-height: 85px;
    cursor: pointer;
    background-color: transparent;
    transition: background-color .3s @ease-in-out;
    &:after{
      border-right: @wrapper-after-width solid  @primary-color;
      content: '';
      height: 84px;
      -webkit-transform: scaleY(.0001);
      transform: scaleY(.0001);
      opacity: 0;
      transition: transform .3s @ease-in-out,opacity .3s @ease-in-out,-webkit-transform .3s @ease-in-out;
    }

    .icon-color{
      color: @primary-color;
    }

    &-content{
      padding: 0 @wrapper-padding;
    }

    &-selected{
      background-color: #fafafa;
      transition: background-color .3s @ease-in-out;

      &:after{
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        opacity: 1;
        transition: transform .3s @ease-in-out,opacity .3s @ease-in-out,-webkit-transform .3s @ease-in-out;
      }
    }
  }

  @list-title: list-title;
  @list-description: list-description;

  .@{list-title} , .@{list-description} {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .@{list-title}-normal, .@{list-description}-normal{
    width: @wrapper-width - @wrapper-padding*2 - @icon-gutter -  @icon-width - @wrapper-after-width;
    transition: width 0.3s @ease-in-out
  }

  .@{list-title}-collapsed, .@{list-description}-collapsed {
    width: @wrapper-width-collapsed - @wrapper-padding*2 - @icon-gutter -  @icon-width - @wrapper-after-width;
    transition: width 0.3s @ease-in-out
  }

  .@{list-title}-normal {
    margin-top: 0;
    transition: margin-top 0.3s @ease-in-out
  }

  .@{list-title}-collapsed {
    margin-top: 5px;
    transition: margin-top 0.3s @ease-in-out
  }

  .@{list-description}-normal{
    opacity: 1;
    height: auto;
    transition: opacity 0.3s @ease-in-out, height 0.3s @ease-in-out;
  }

  .@{list-description}-collapsed{
    opacity: 0;
    height: 0;
    transition: opacity 0.3s @ease-in-out, height 0.3s @ease-in-out;
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
