import {
    createRouter,
    createWebHistory,
    createWebHashHistory,
    createMemoryHistory
} from 'vue-router'

import ViewUIPlus from 'view-ui-plus'

import util from '@/libs/util'

import Setting from '@/setting'

// 路由数据
import routes from './routes'
import { usePageStore } from '@/store'

// 导出路由 在 main.ts 里使用
const router = createRouter({
    history:
        Setting.routerMode === 'history'
            ? createWebHistory(Setting.routerBase)
            : Setting.routerMode === 'hash'
              ? createWebHashHistory(Setting.routerBase)
              : createMemoryHistory(Setting.routerBase),
    routes
})

/**
 * 路由拦截
 * 权限验证
 */

router.beforeEach((to, _from, next) => {
    if (Setting.showProgressBar) ViewUIPlus.LoadingBar.start()
    // 判断是否需要登录才可以进入
    if (to.matched.some((_) => _.meta.auth)) {
        // 这里依据 token 判断是否登录，可视情况修改
        const token = util.cookies.get('token')

        if (token && token !== 'undefined') {
            next()
        } else {
            // 没有登录的时候跳转到登录界面
            // 携带上登陆成功之后需要跳转的页面完整路径
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    } else {
        // 不需要身份校验 直接通过
        next()
    }
})

router.afterEach((to) => {
    const pageStore = usePageStore()
    if (Setting.showProgressBar) ViewUIPlus.LoadingBar.finish()
    // 多页控制 打开新的页面
    if (!('meta' in to) || (to.meta && !('tabs' in to.meta)) || (to.meta && to.meta.tabs)) {
        pageStore.open(to)
    }
    // 更改标题
    util.title({
        title: to.meta.title
    })
    // 返回页面顶端
    window.scrollTo(0, 0)
})
export default router
