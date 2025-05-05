<template>
    <span
        class="i-layout-header-trigger"
        :class="{ 'i-layout-header-trigger-min': showReload }"
        @click="handleToggleMenuSide"
    >
        <Icon custom="i-icon i-icon-menu-unfold" v-show="menuCollapse || isMobile" />
        <Icon custom="i-icon i-icon-menu-fold" v-show="!menuCollapse && !isMobile" />
    </span>
</template>
<script lang="ts" setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'
import { useRoute } from 'vue-router'

defineOptions({ name: 'iHeaderCollapse' })

const emit = defineEmits(['on-toggle-drawer'])

const route = useRoute()
const layoutStore = useLayoutStore()
const { isMobile, isTablet, isDesktop, menuCollapse, showReload } = storeToRefs(useLayoutStore())

// 展开/收起侧边栏
const handleToggleMenuSide = (state: any) => {
    if (isMobile.value) {
        layoutStore.updateMenuCollapse(false)
        emit('on-toggle-drawer', state)
    } else {
        layoutStore.updateMenuCollapse(!menuCollapse.value)
    }
}
// 切换页面时，在移动端自动收起侧边栏
// 强行传参 false 是因为有的路由不是在菜单栏发生的，toggle 会使其显示
watch(
    () => route,
    () => {
        if (isMobile.value) handleToggleMenuSide(false)
    }
)
// 在平板时自动收起菜单
watch(
    () => isTablet.value,
    (state) => {
        if (!isMobile.value && state) layoutStore.updateMenuCollapse(true)
    }
)
// 在桌面时自动展开菜单
watch(
    () => isDesktop.value,
    (state) => {
        if (!isMobile.value && state) layoutStore.updateMenuCollapse(false)
    }
)
</script>
