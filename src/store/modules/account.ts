import { defineStore } from 'pinia'
import { Login, GetUserInfo, Register } from '@/api/account'
import util from '@/libs/util'
import Setting from '@/setting'
import { useUserStore, useMenuStore, usePageStore } from '@/store'
import router from '@/router'
import { Modal } from 'view-ui-plus'

const storeSetup = () => {
    const userStore = useUserStore()
    const menuStore = useMenuStore()
    const pageStore = usePageStore()
    /** 登录 */
    const login = ({ username = '', password = '' } = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                // 开始请求登录接口
                const { token } = await Login({
                    username,
                    password
                })
                // 设置 cookie 一定要存 uuid 和 token 两个 cookie
                // 整个系统依赖这两个数据进行校验和存储
                // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
                // token 代表用户当前登录状态 建议在网络请求中携带 token
                // 如有必要 token 需要定时更新，默认保存一天，可在 setting.ts 中修改
                // 如果你的 token 不是通过 cookie 携带，而是普通字段，也可视情况存储在 localStorage

                util.cookies.set('token', token)
                const res = await GetUserInfo()
                util.cookies.set('uuid', res.uuid)
                // 设置 pinia 用户信息
                await userStore.set(res.info)
                // 用户登录后从持久化数据加载一系列的设置
                await load({ loadOpenedTabs: Setting.page.loadOpenedTabs })
                // 获取动态菜单
                if (Setting.dynamicMenu) await menuStore.getMenuList(false)
                // 结束
                resolve(null)
            } catch (err) {
                reject(err)
            }
        })
    }
    /** 退出登录 */
    const logout = async ({ confirm = false, i18n = (_text: string) => '' }) => {
        async function logout() {
            // 删除cookie
            util.cookies.remove('token')
            util.cookies.remove('uuid')
            // 清空 vuex 用户信息
            await userStore.set({})
            // 跳转路由
            router.push({
                name: 'login'
            })
        }

        if (confirm) {
            Modal.confirm({
                title: i18n('basicLayout.logout.confirmTitle'),
                content: i18n('basicLayout.logout.confirmContent'),
                async onOk() {
                    await logout()
                }
            })
        } else {
            await logout()
        }
    }
    /** 注册 */
    const register = ({ mail = '', password = '', mobile = '', captcha = '' } = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                // 开始请求登录接口
                const res = await Register({
                    mail,
                    password,
                    mobile,
                    captcha
                })
                // 注册成功后，完成与登录一致的操作
                // 注册也可视情况不返还 uuid、token 等数据，在注册完成后，由前端自动执行一次登录逻辑
                util.cookies.set('uuid', res.uuid)
                util.cookies.set('token', res.token)
                // 设置 vuex 用户信息
                await userStore.set(res['info'])
                // 用户登录后从持久化数据加载一系列的设置
                await load()
                // 结束
                resolve(null)
            } catch (err) {
                reject(err)
            }
        })
    }

    /** 用户登录后从持久化数据加载一系列的设置 */
    // loadOpenedTabs 是否加载页签信息
    const load = ({ loadOpenedTabs = true } = {}) => {
        return new Promise(async (resolve) => {
            // 加载用户登录信息
            await userStore.load()
            // 持久化数据加载上次退出时的多页列表
            await pageStore.openedLoad({ loadOpenedTabs })
            // end
            resolve(null)
        })
    }

    return {
        login,
        logout,
        register,
        load
    }
}

export const useAccountStore = defineStore('account', storeSetup)
