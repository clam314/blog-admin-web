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
            <a slot="title" class="list-title" :class="!collapsed? 'list-title-normal' : 'list-title-collapsed'">{{ item.title }}</a>
            <a-badge slot="avatar">
              <a-icon slot="count" class="icon-color" type="check" v-if="item.published"/>
              <a-avatar class="list-icon icon-color" :icon="fileIcon(item.content)" />
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
      busy: false,
      pageNum: 1,
      pageCount: 10,
      selectedItem: null,
      iconColor: defaultSettings.primaryColor,
      data: []
    }
  },
  beforeMount () {
    this.busy = true
    this.loading = true
  },
  watch: {
    folder (val) {
      if (val) {
        console.log(val)
        this.busy = true
        this.loading = true
        this.data = []
        this.getData(res => {
          this.loading = false
          this.busy = false
          if (res.result) {
            this.data = res.result.list
            this.onSelectChange(this.data[0])
          }
        })
      }
    }
  },
  methods: {
    getData (callback) {
      const param = {
        fid: this.folder.fid,
        pageNum: this.pageNum,
        pageCount: this.pageCount
      }
      getArticles(param).then(res => {
        this.pageNum = this.pageNum + 1
        callback(res)
      })
    },
    onLoadMore () {
      if (!this.folder || !this.folder.fid) {
        return
      }
      this.busy = true
      this.loading = true
      this.getData(res => {
        this.data = this.data.concat(res.result.list)
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
