import { h } from 'vue'

import dashboard from './modules/dashboard'
import BasicLayout from '@/layouts/basic-layout/index.vue'

/**
 * 在主框架内显示
 */

const frameIn = [
    {
        path: '/',
        redirect: {
            name: 'dashboard-console'
        },
        component: BasicLayout,
        children: [
            {
                path: 'index',
                name: 'index',
                redirect: {
                    name: 'dashboard-console'
                }
            },
            {
                path: 'log',
                name: 'system-log',
                meta: {
                    title: '前端日志',
                    auth: true
                },
                component: () => import('@/pages/system/log/index.vue')
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                component: {
                    beforeRouteEnter(_to: any, from: any, next: any) {
                        next((instance: any) => instance.$router.replace(from.fullPath))
                    },
                    render: () => h(null as any)
                }
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: {
                    beforeRouteEnter(_to: any, from: any, next: any) {
                        next((instance: any) =>
                            instance.$router.replace(JSON.parse(from.params.route))
                        )
                    },
                    render: () => h(null as any)
                }
            }
        ]
    },
    dashboard
]

/**
 * 在主框架之外显示
 */

const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '$t:page.login.title'
        },
        component: () => import('@/pages/account/login/index.vue')
    },
    // 注册
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '$t:page.register.title'
        },
        component: () => import('@/pages/account/register/index.vue')
    },
    // 注册结果
    {
        path: '/register/result',
        name: 'register-result',
        meta: {
            auth: true,
            title: '注册结果'
        },
        component: () => import('@/pages/account/register/result/index.vue')
    }
]

/**
 * 错误页面
 */

const errorPage = [
    {
        path: '/403',
        name: '403',
        meta: {
            title: '403'
        },
        component: () => import('@/pages/system/error/403/index.vue')
    },
    {
        path: '/500',
        name: '500',
        meta: {
            title: '500'
        },
        component: () => import('@/pages/system/error/500/index.vue')
    },
    {
        path: '/:pathMatch(.*)',
        name: '404',
        meta: {
            title: '404'
        },
        component: () => import('@/pages/system/error/404/index.vue')
    }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
const routes = [...frameIn, ...frameOut, ...errorPage]

export default routes
