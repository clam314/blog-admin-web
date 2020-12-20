<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="" target="_blank">Clam's blog</a>
      <a href="https://github.com/clam314/blog-admin-web.git" target="_blank">Github</a>
      <a href="https://github.com/clam314" target="_blank">@clam314</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
