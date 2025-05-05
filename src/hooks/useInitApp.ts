import { onMounted, watch, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import i18n from '@/i18n'
import { loadRemoteLocaleMessages } from '@/i18n/locale'
import Setting from '@/setting'
import { frameInRoutes } from '@/router/routes'
import menuHeader from '@/menu/header'
import { usePageStore, useMenuStore, useUserStore, useLayoutStore } from '@/store'

let isFirstRouteChange = true

export function useInitApp() {
    const route = useRoute()
    const pageStore = usePageStore()
    const menuStore = useMenuStore()
    const userStore = useUserStore()
    const layoutStore = useLayoutStore()
    const instance = getCurrentInstance()

    onMounted(async () => {
        // 初始化页面路由
        pageStore.init(frameInRoutes)

        // 设置顶栏菜单
        if (!Setting.dynamicMenu) {
            menuStore.setHeader(menuHeader)
        }

        // 加载用户数据
        await userStore.load()

        // 初始化全屏监听
        await layoutStore.listenFullscreen()

        // 设置全局 $app
        if (window && instance) {
            const global: any = window as any
            global['$app'] = instance
            global['$app'].$t = i18n.global.t
        }

        // 加载远程 i18n
        if (Setting.i18n.remote) {
            await loadRemoteLocaleMessages(i18n)
        }
    })

    watch(
        () => route,
        async (to) => {
            menuStore.setMenuList(to)

            if (Setting.dynamicMenu && isFirstRouteChange) {
                isFirstRouteChange = false
                await menuStore.getMenuList(route)
            }

            // // 调用 mixin 中的 appRouteChange（如果存在）
            // if (instance?.proxy?.appRouteChange) {
            //     instance.proxy.appRouteChange(to, from)
            // }
        },
        { deep: true }
    )
}
