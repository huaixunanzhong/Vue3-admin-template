/**
 * 菜单
 * */
import { cloneDeep } from 'lodash'
import {
    includeArray,
    setNativeMenuSider,
    setNativeMenuHeader,
    getHeaderName,
    getMenuSider,
    getSiderSubmenu,
    getNativeMenuSider,
    getNativeMenuHeader
} from '@/libs/system'
import router from '@/router'
import { MenuList } from '@/api/menu'
import Setting from '@/setting'
import menuSider from '@/menu/sider'
import { MenuState } from './types/menu.ts'
import { GetterTree, MutationTree } from 'vuex'
import { RootState } from '@/store/type.ts'

// 根据 menu 配置的权限，过滤菜单
function filterMenu(menuList: Record<string, any>[], access: any, lastList: any) {
    menuList.forEach((menu) => {
        let menuAccess = menu.auth

        if (!menuAccess || includeArray(menuAccess, access)) {
            let newMenu: any = {}
            for (let i in menu) {
                if (i !== 'children') newMenu[i] = cloneDeep(menu[i])
            }
            if (menu.children && menu.children.length) newMenu.children = []

            lastList.push(newMenu)
            menu.children && filterMenu(menu.children, access, newMenu.children)
        }
    })
    return lastList
}

const state: MenuState = {
    // 顶部菜单
    header: [],
    // 侧栏菜单
    sider: [],
    // 当前顶栏菜单的 name
    headerName: '',
    // 当前所在菜单的 path
    activePath: '',
    // 展开的子菜单 name 集合
    openNames: [],
    // 所有的菜单
    menuSider: [],
    // 侧边菜单徽标
    siderMenuBadge: Setting.badge.siderMenuBadge,
    // 顶栏菜单徽标
    headerMenuBadge: Setting.badge.headerMenuBadge
}

const getters: GetterTree<MenuState, RootState> = {
    /** 根据 user 里登录用户权限，对侧边菜单进行鉴权过滤 */
    filterSider(state: any, _: any, rootState: any) {
        const userInfo = rootState.admin.user.info
        // @权限
        const access = userInfo.access
        if (access && access.length) {
            return filterMenu(state.sider, access, [])
        } else {
            return filterMenu(state.sider, [], [])
        }
    },
    /** 根据 user 里登录用户权限，对顶栏菜单进行鉴权过滤 */
    filterHeader(state: any, _getter: any, rootState: any) {
        const userInfo = rootState.admin.user.info
        // @权限
        const access = userInfo.access
        if (access && access.length) {
            return state.header.filter((item: any) => {
                let state = true
                if (item.auth && !includeArray(item.auth, access)) state = false
                if (item.children && item.children.length) {
                    item.children = item.children.filter((child: any) => {
                        let state = true
                        if (child.auth && !includeArray(child.auth, access)) state = false
                        return state
                    })
                }
                return state
            })
        } else {
            return state.header.filter((item: any) => {
                let state = true
                if (item.auth && item.auth.length) state = false
                if (item.children && item.children.length) {
                    item.children = item.children.filter((child: any) => {
                        let state = true
                        if (child.auth && child.auth.length) state = false
                        return state
                    })
                }
                return state
            })
        }
    },
    /** 当前 header 的全部信息 */
    currentHeader(state: any) {
        return state.header.find((item: any) => item.name === state.headerName)
    },
    /** 在当前 header 下，是否隐藏 sider（及折叠按钮） */
    hideSider(_state: any, getters: any) {
        let visible = false
        if (getters.currentHeader && 'hideSider' in getters.currentHeader)
            visible = getters.currentHeader.hideSider
        return visible
    }
}

const mutations: MutationTree<MenuState> = {
    /** 设置侧边栏菜单 */
    setSider(state: any, menu: any) {
        state.sider = menu
    },
    /** 设置顶栏菜单 */
    setHeader(state: any, menu: any) {
        state.header = menu
    },
    /** 设置当前顶栏菜单 name name:headerName */
    setHeaderName(state: any, name: any) {
        state.headerName = name
    },
    /** 设置当前所在菜单的 path，用于侧栏菜单高亮当前项  path: fullPath*/
    setActivePath(state: any, path: any) {
        state.activePath = path
    },
    /** 设置当前所在菜单的全部展开父菜单的 names 集合 names: openNames */
    setOpenNames(state: any, names: any) {
        state.openNames = names
    },
    /** 设置所有菜单 */
    setMenuSider(state: any, menuSider: any) {
        state.menuSider = menuSider
    },
    /** 设置全部的侧边菜单的徽标 */
    setAllSiderMenuBadge(state: any, data: any) {
        state.siderMenuBadge = data
    },
    /** 新增或修改某个侧边菜单的徽标 */
    setSiderMenuBadge(state: any, { path, badge }: any) {
        const siderMenuBadge = cloneDeep(state.siderMenuBadge)
        const menuIndex = siderMenuBadge.findIndex((item: any) => item.path === path)
        if (menuIndex >= 0) {
            siderMenuBadge[menuIndex] = badge
            state.siderMenuBadge = siderMenuBadge
        } else {
            state.siderMenuBadge.push(badge)
        }
    },
    /** 删除某个侧边菜单的徽标 */
    removeSiderMenuBadge(state: any, path: any) {
        const menuIndex = state.siderMenuBadge.findIndex((item: any) => item.path === path)
        if (menuIndex >= 0) state.siderMenuBadge.splice(menuIndex, 1)
    },
    /** 设置全部的顶栏菜单的徽标 */
    setAllHeaderMenuBadge(state: any, data: any) {
        state.headerMenuBadge = data
    },
    /** 新增或修改某个顶栏菜单的徽标 */
    setHeaderMenuBadge(state: any, { path, badge }: any) {
        const headerMenuBadge = cloneDeep(state.headerMenuBadge)
        const menuIndex = headerMenuBadge.findIndex((item: any) => item.path === path)
        if (menuIndex >= 0) {
            headerMenuBadge[menuIndex] = badge
            state.headerMenuBadge = headerMenuBadge
        } else {
            state.headerMenuBadge.push(badge)
        }
    },
    /** 删除某个顶栏菜单的徽标 */
    removeHeaderMenuBadge(state: any, path: any) {
        const menuIndex = state.headerMenuBadge.findIndex((item: any) => item.path === path)
        if (menuIndex >= 0) state.headerMenuBadge.splice(menuIndex, 1)
    }
}

const actions = {
    /** 设置菜单（动态+静态） */
    setMenuList({ commit }: any, to: Record<any, any> = {}) {
        // 只动态菜单设置顶栏菜单
        if (Setting.dynamicMenu) {
            // 设置顶栏菜单
            const menuHeaderList = getNativeMenuHeader()
            commit('setHeader', menuHeaderList)
        }
        // 设置侧边栏菜单
        const menuSiderList = Setting.dynamicMenu ? getNativeMenuSider() : [...menuSider]
        let path = to.matched[to.matched.length - 1].path

        let headerName = getHeaderName(path, menuSiderList)
        if (headerName === null) {
            path = to.path
            headerName = getHeaderName(path, menuSiderList)
        }
        // 在 404 时，是没有 headerName 的
        if (headerName !== null) {
            commit('setHeaderName', headerName)
            commit('setMenuSider', menuSiderList)

            const filterMenuSider = getMenuSider(menuSiderList, headerName)
            commit('setSider', filterMenuSider)
            commit('setActivePath', to.path)

            const openNames = getSiderSubmenu(path, menuSiderList)
            commit('setOpenNames', openNames)
        }
    },
    /** 动态获取菜单 */
    /** 是否加载菜单，需传 $route 信息 */
    getMenuList({ dispatch }: any, loadMenu: any) {
        return new Promise((resolve, reject) => {
            MenuList()
                .then((res: any) => {
                    setNativeMenuHeader(res['header'])
                    setNativeMenuSider(res['sider'])
                    if (loadMenu) {
                        const to = loadMenu === true ? router.currentRoute.value : loadMenu
                        dispatch('setMenuList', to)
                    }
                    resolve(null)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
