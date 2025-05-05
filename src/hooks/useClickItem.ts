import { useLayoutStore } from '@/store'
import { findComponentUpward } from '@/libs/assist.ts'
import { useRoute } from 'vue-router'

export const useClickItem = () => {
    const route = useRoute()
    const layoutStore = useLayoutStore()
    const handleClick = (path: string, type = 'sider') => {
        if (route.path === path) {
            if (type === 'sider' && layoutStore.menuSiderReload) handleReload()
            else if (type === 'header' && layoutStore.menuHeaderReload) handleReload()
        }
    }
    const handleReload = () => {
        const $layout = findComponentUpward(this, 'BasicLayout')
        if ($layout) $layout.handleReload()
    }

    return {
        handleClick
    }
}
