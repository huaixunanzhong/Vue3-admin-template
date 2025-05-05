<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { on, off } from '@/libs/dom'
import { setMatchMedia } from '@/libs/assist'
import { useLayoutStore } from '@/store'
import { useInitApp } from '@/hooks'

defineOptions({ name: 'app' })
setMatchMedia()

const layoutStore = useLayoutStore()

useInitApp()

const handleWindowResize = () => {
    handleMatchMedia()
    handleSetBodyHeight()
}

const handleMatchMedia = () => {
    const matchMedia = window.matchMedia

    if (matchMedia('(max-width: 600px)').matches) {
        layoutStore.setDevice('Mobile')
    } else if (matchMedia('(max-width: 992px)').matches) {
        layoutStore.setDevice('Tablet')
    } else {
        layoutStore.setDevice('Desktop')
    }
}

const handleSetBodyHeight = () => {
    layoutStore.setBodyHeight(document.body.offsetHeight)
}

onMounted(() => {
    if (on) {
        on(window, 'resize', handleWindowResize)
    }
    handleMatchMedia()
    handleSetBodyHeight()
})

onBeforeUnmount(() => {
    off(window, 'resize', handleWindowResize)
})
</script>
