import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Setting from '@/setting'
import menuSliders from '@/menu/sider'
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
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { MenuList } from '@/api/menu'

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

const storeSetup = () => {
    const router = useRouter()
    const userStore = useUserStore()

    // 顶部菜单
    const header = ref<App.HeaderItem[]>([])
    // 侧栏菜单
    const sider = ref([])
    // 当前顶栏菜单的 name
    const headerName = ref('')
    // 当前所在菜单的 path
    const activePath = ref('')
    // 展开的子菜单 name 集合
    const openNames = ref([])
    // 所有的菜单
    const menuSider = ref([])
    // 侧边菜单徽标
    const siderMenuBadge = ref(Setting.badge.siderMenuBadge)
    // 顶栏菜单徽标
    const headerMenuBadge = ref(Setting.badge.headerMenuBadge)

    /** 根据 user 里登录用户权限，对侧边菜单进行鉴权过滤 */
    const filterSider = computed(() => {
        const userInfo = userStore.userInfo
        // @权限
        const access = userInfo.access
        if (access && access.length) {
            return filterMenu(sider.value, access, [])
        } else {
            return filterMenu(sider.value, [], [])
        }
    })
    /** 根据 user 里登录用户权限，对顶栏菜单进行鉴权过滤 */
    const filterHeader = computed(() => {
        const userInfo = userStore.userInfo
        // @权限
        const access = userInfo.access
        if (access && access.length) {
            return header.value.filter((item: any) => {
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
            return header.value.filter((item) => {
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
    })
    /** 当前 header 的全部信息 */
    const currentHeader = computed(() => {
        return header.value.find((item) => item.name === headerName.value)
    })
    /** 在当前 header 下，是否隐藏 sider（及折叠按钮） */
    const hideSider = computed(() => {
        let visible = false
        if (currentHeader.value && 'hideSider' in currentHeader.value)
            visible = currentHeader.value.hideSider
        return visible
    })

    /** 设置侧边栏菜单 */
    const setSider = (menu: any) => {
        sider.value = menu
    }
    /** 设置顶栏菜单 */
    const setHeader = (menu: any) => {
        header.value = menu
    }
    /** 设置当前顶栏菜单 name name:headerName */
    const setHeaderName = (name: any) => {
        headerName.value = name
    }
    /** 设置当前所在菜单的 path，用于侧栏菜单高亮当前项  path: fullPath*/
    const setActivePath = (path: any) => {
        activePath.value = path
    }
    /** 设置当前所在菜单的全部展开父菜单的 names 集合 names: openNames */
    const setOpenNames = (names: any) => {
        openNames.value = names
    }
    /** 设置所有菜单 */
    const setMenuSider = (_menuSider: any) => {
        menuSider.value = _menuSider
    }
    /** 设置全部的侧边菜单的徽标 */
    const setAllSiderMenuBadge = (data: any) => {
        siderMenuBadge.value = data
    }
    /** 新增或修改某个侧边菜单的徽标 */
    const setSiderMenuBadge = ({ path, badge }: any) => {
        const _siderMenuBadge = cloneDeep(siderMenuBadge.value)
        const menuIndex = _siderMenuBadge.findIndex((item: any) => item.path === path)
        if (menuIndex >= 0) {
            _siderMenuBadge[menuIndex] = badge
            siderMenuBadge.value = _siderMenuBadge
        } else {
            siderMenuBadge.value.push(badge)
        }
    }
    /** 删除某个侧边菜单的徽标 */
    const removeSiderMenuBadge = (path: any) => {
        const menuIndex = siderMenuBadge.value.findIndex((item: any) => item.path === path)
        if (menuIndex >= 0) siderMenuBadge.value.splice(menuIndex, 1)
    }
    /** 设置全部的顶栏菜单的徽标 */
    const setAllHeaderMenuBadge = (data: any) => {
        headerMenuBadge.value = data
    }
    /** 新增或修改某个顶栏菜单的徽标 */
    const setHeaderMenuBadge = ({ path, badge }: any) => {
        const _headerMenuBadge = cloneDeep(headerMenuBadge.value)
        const menuIndex = _headerMenuBadge.findIndex((item: any) => item.path === path)
        if (menuIndex >= 0) {
            _headerMenuBadge[menuIndex] = badge
            headerMenuBadge.value = _headerMenuBadge
        } else {
            headerMenuBadge.value.push(badge)
        }
    }
    /** 删除某个顶栏菜单的徽标 */
    const removeHeaderMenuBadge = (path: any) => {
        const menuIndex = headerMenuBadge.value.findIndex((item: any) => item.path === path)
        if (menuIndex >= 0) headerMenuBadge.value.splice(menuIndex, 1)
    }

    /** 设置菜单（动态+静态） */
    const setMenuList = (to = {}) => {
        // 只动态菜单设置顶栏菜单
        if (Setting.dynamicMenu) {
            // 设置顶栏菜单
            const menuHeaderList = getNativeMenuHeader()
            setHeader(menuHeaderList)
        }
        // 设置侧边栏菜单
        const menuSiderList = Setting.dynamicMenu ? getNativeMenuSider() : [...menuSliders]

        let path = to.matched[to.matched.length - 1].path

        let headerName = getHeaderName(path, menuSiderList)
        if (headerName === null) {
            path = to.path
            headerName = getHeaderName(path, menuSiderList)
        }
        // 在 404 时，是没有 headerName 的
        if (headerName !== null) {
            setHeaderName(headerName)
            setMenuSider(menuSiderList)

            const filterMenuSider = getMenuSider(menuSiderList, headerName)
            setSider(filterMenuSider)
            setActivePath(to.path)

            const openNames = getSiderSubmenu(path, menuSiderList)
            setOpenNames(openNames)
        }
    }
    /** 动态获取菜单 */
    /** 是否加载菜单，需传 $route 信息 */
    const getMenuList = (loadMenu: any) => {
        return new Promise((resolve, reject) => {
            MenuList()
                .then((res: any) => {
                    setNativeMenuHeader(res['header'])
                    setNativeMenuSider(res['sider'])
                    if (loadMenu) {
                        const to = loadMenu === true ? router.currentRoute.value : loadMenu
                        setMenuList(to)
                    }
                    resolve(null)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    return {
        header,
        sider,
        headerName,
        activePath,
        openNames,
        menuSider,
        siderMenuBadge,
        headerMenuBadge,
        filterSider,
        filterHeader,
        currentHeader,
        hideSider,
        setSider,
        setHeader,
        setHeaderName,
        setActivePath,
        setOpenNames,
        setMenuSider,
        setAllSiderMenuBadge,
        setSiderMenuBadge,
        setHeaderMenuBadge,
        removeSiderMenuBadge,
        setAllHeaderMenuBadge,
        removeHeaderMenuBadge,
        setMenuList,
        getMenuList
    }
}

export const useMenuStore = defineStore('menu', storeSetup)
