<template>
    <span
        class="i-layout-header-trigger i-layout-header-trigger-min"
        @click="layoutStore.toggleFullscreen"
    >
        <Icon custom="i-icon i-icon-full-screen" v-show="!isFullscreen" />
        <Icon custom="i-icon i-icon-exit-full-screen" v-show="isFullscreen" />
    </span>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'

defineOptions({ name: 'iHeaderFullscreen' })

const layoutStore = useLayoutStore()
const { isFullscreen } = storeToRefs(layoutStore)
</script>
