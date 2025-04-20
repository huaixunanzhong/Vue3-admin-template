<template>
    <GlobalFooter class="i-copyright" :links="links" :copyright="copyright" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { GlobalFooter } from 'view-ui-plus'

defineOptions({ name: 'i-copyright' })

const links = ref([
    {
        title: '官网',
        key: '官网',
        href: 'https://www.iviewui.com',
        blankTarget: true
    },
    {
        title: '社区',
        key: '社区',
        href: 'https://dev.iviewui.com',
        blankTarget: true
    },
    {
        title: 'Admin Plus',
        key: '专业版',
        href: 'https://www.iviewui.com/admin-plus',
        blankTarget: true
    }
])

const copyright = ref('Copyright © 2022 View Design All Rights Reserved')
</script>

<style lang="less" scoped>
.i-copyright {
    flex: 0 0 auto;
    &-hidden {
        display: none;
    }
}
</style>
