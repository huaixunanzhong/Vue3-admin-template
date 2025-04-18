/**
 * 注册、登录、注销
 * */
import util from '@/libs/util'
import router from '@/router'
import Setting from '@/setting'
import { AccountLogin, AccountRegister } from '@/api/account'
import { Modal } from 'view-ui-plus'
import { RootState } from '@/store/type.ts'
import { ActionContext, ActionTree } from 'vuex'
import type { AccountState, loadParams, loginParams, registerParams } from './types/account.ts'

const actions: ActionTree<AccountState, RootState> = {
    /** 登录 */
    login(
        { dispatch }: ActionContext<AccountState, RootState>,
        { username = '', password = '' }: loginParams = {}
    ): Promise<null> {
        return new Promise(async (resolve, reject) => {
            try {
                // 开始请求登录接口
                const res: Record<string, any> = await AccountLogin({
                    username,
                    password
                })
                // 设置 cookie 一定要存 uuid 和 token 两个 cookie
                // 整个系统依赖这两个数据进行校验和存储
                // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
                // token 代表用户当前登录状态 建议在网络请求中携带 token
                // 如有必要 token 需要定时更新，默认保存一天，可在 setting.ts 中修改
                // 如果你的 token 不是通过 cookie 携带，而是普通字段，也可视情况存储在 localStorage
                util.cookies.set('uuid', res['uuid'])
                util.cookies.set('token', res['token'])
                // 设置 vuex 用户信息
                await dispatch('admin/user/set', res['info'], { root: true })
                // 用户登录后从持久化数据加载一系列的设置
                await dispatch('load', { loadOpenedTabs: Setting.page.loadOpenedTabs })
                // 获取动态菜单
                if (Setting.dynamicMenu)
                    await dispatch('admin/menu/getMenuList', false, { root: true })
                // 结束
                resolve(null)
            } catch (err) {
                reject(err)
            }
        })
    },
    /** 退出登录 */
    async logout(
        { dispatch },
        { confirm = false, vm = {} }: { confirm: boolean; vm: Record<any, any> } = {
            confirm: false,
            vm: {}
        }
    ) {
        async function logout() {
            // 删除cookie
            util.cookies.remove('token')
            util.cookies.remove('uuid')
            // 清空 vuex 用户信息
            await dispatch('admin/user/set', {}, { root: true })
            // 跳转路由
            router.push({
                name: 'login'
            })
        }

        if (confirm) {
            Modal.confirm({
                title: vm.$t('basicLayout.logout.confirmTitle'),
                content: vm.$t('basicLayout.logout.confirmContent'),
                async onOk() {
                    await logout()
                }
            })
        } else {
            await logout()
        }
    },
    /** 注册 */
    register(
        { dispatch },
        { mail = '', password = '', mobile = '', captcha = '' }: registerParams = {}
    ) {
        return new Promise(async (resolve, reject) => {
            try {
                // 开始请求登录接口
                const res: Record<string, any> = await AccountRegister({
                    mail,
                    password,
                    mobile,
                    captcha
                })
                // 注册成功后，完成与登录一致的操作
                // 注册也可视情况不返还 uuid、token 等数据，在注册完成后，由前端自动执行一次登录逻辑
                util.cookies.set('uuid', res['uuid'])
                util.cookies.set('token', res['token'])
                // 设置 vuex 用户信息
                await dispatch('admin/user/set', res['info'], { root: true })
                // 用户登录后从持久化数据加载一系列的设置
                await dispatch('load')
                // 结束
                resolve(null)
            } catch (err) {
                reject(err)
            }
        })
    },
    /**
     * @description 用户登录后从持久化数据加载一系列的设置
     * @param {Object} state vuex state
     * @param {Object} dispatch vuex dispatch
     * @param {Object} loadOpenedTabs 是否加载页签信息
     */

    /** 用户登录后从持久化数据加载一系列的设置 */
    load({ dispatch }: Record<string, any>, { loadOpenedTabs = true }: loadParams = {}) {
        return new Promise(async (resolve) => {
            // 加载用户登录信息
            await dispatch('admin/user/load', null, { root: true })
            // 持久化数据加载上次退出时的多页列表
            await dispatch('admin/page/openedLoad', { loadOpenedTabs }, { root: true })
            // end
            resolve(null)
        })
    }
}

export default {
    namespaced: true,
    actions
}
