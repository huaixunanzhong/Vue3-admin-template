<template>
    <div :style="styles" v-if="waterMark.show"></div>
</template>
<script lang="ts" setup>
import { computed, CSSProperties } from 'vue'
import getWaterMarkCanvas from '@/libs/water-mark'
import { useStore } from '@/store'
defineOptions({ name: 'i-water-mark' })

const store = useStore()

const waterMark = computed(() => store.state.admin.layout.waterMark)

const styles = computed<CSSProperties>(() => {
    const url = getWaterMarkCanvas(waterMark.value.text, waterMark.value.options)
    return {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '2000',
        backgroundSize: '320px',
        backgroundRepeat: 'repeat',
        backgroundImage: `url(${url})`,
        pointerEvents: 'none'
    }
})
</script>
