<template>
  <a-drawer
    title="Basic Drawer"
    width="350"
    :placement="placement"
    :closable="false"
    :visible="drawerVisible"
    @close="closeInfoDrawer"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>
<script>
export default {
  props: {
    drawerVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    closeInfoDrawer (){
      this.drawerVisible = false
    }
  }
}
</script>
