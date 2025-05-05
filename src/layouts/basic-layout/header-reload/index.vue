<template>
    <span
        class="i-layout-header-trigger"
        :class="{ 'i-layout-header-trigger-min': showSiderCollapse }"
        @click="handleReload"
    >
        <Icon custom="i-icon i-icon-refresh" />
    </span>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'
defineOptions({ name: 'iHeaderReload' })

const emit = defineEmits(['on-reload'])

const { showSiderCollapse } = storeToRefs(useLayoutStore())

const handleReload = () => {
    emit('on-reload')
}
</script>
