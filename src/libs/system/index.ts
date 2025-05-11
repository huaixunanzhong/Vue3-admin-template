/**
 * 系统内置方法集，正常情况下您不应该修改或移除此文件
 * */

import { cloneDeep } from 'lodash'
import Setting from '@/setting'

/**
 * @description 根据当前路由，找到顶部菜单名称
 * @param {String} currentPath 当前路径
 * @param {Array} menuList 所有路径
 * */
function getHeaderName(currentPath: string, menuList: Menu.MenuItem[]) {
    const allMenus: Menu.MenuItem[] = []
    menuList.forEach((menu) => {
        const headerName = menu.header || ''
        const menus = transferMenu(menu, headerName)
        allMenus.push({
            path: menu.path,
            header: headerName
        })
        menus.forEach((item) => allMenus.push(item))
    })
    const currentMenu = allMenus.find((item) => item.path === currentPath)
    return (currentMenu ? currentMenu.header : null) as string | null
}
/** 菜单数组扁平化为一维数组 */
function transferMenu(menu: Menu.MenuItem, headerName: string): Menu.MenuItem[] {
    if (menu.children && menu.children.length) {
        return menu.children.reduce((all: Menu.MenuItem[], item) => {
            all.push({
                path: item.path,
                header: headerName
            })
            const foundChildren = transferMenu(item, headerName)
            return all.concat(foundChildren)
        }, [])
    } else {
        return [menu]
    }
}

export { getHeaderName }

/**
 * @description 根据当前顶栏菜单 name，找到对应的二级菜单
 * @param {Array} menuList 所有的二级菜单
 * @param {String} headerName 当前顶栏菜单的 name
 * */
function getMenuSider(menuList: Menu.MenuItem[], headerName: string = '') {
    if (headerName) {
        return menuList.filter((item: any) => item.header === headerName)
    } else {
        return menuList
    }
}

export { getMenuSider }

/**
 * @description 根据当前路由，找到其所有父菜单 path，作为展开侧边栏 open-names 依据
 * @param {String} currentPath 当前路径
 * @param {Array} menuList 所有路径
 * */
function getSiderSubmenu(currentPath: string, menuList: Menu.MenuItem[]) {
    const allMenus: Menu.SubMenuItem[] = []
    menuList.forEach((menu) => {
        const menus = transferSubMenu(menu, [])
        allMenus.push({
            path: menu.path,
            openNames: []
        })
        menus.forEach((item) => allMenus.push(item))
    })
    const currentMenu = allMenus.find((item) => item.path === currentPath)
    return currentMenu ? currentMenu.openNames : []
}
/** 扁平化二级菜单 */
function transferSubMenu(menu: Menu.MenuItem, openNames: string[]): Menu.SubMenuItem[] {
    if (menu.children && menu.children.length) {
        const itemOpenNames = openNames.concat([menu.path])
        return menu.children.reduce((all: Menu.SubMenuItem[], item) => {
            all.push({
                path: item.path,
                openNames: itemOpenNames
            })
            const foundChildren = transferSubMenu(item, itemOpenNames)
            return all.concat(foundChildren)
        }, [])
    } else {
        return [menu].map((item) => {
            return {
                path: item.path,
                openNames: openNames
            }
        })
    }
}

export { getSiderSubmenu }

/**
 * @description 递归获取所有子菜单
 * */
function getAllSiderMenu(menuList: any) {
    let allMenus: any[] = []

    menuList.forEach((menu: any) => {
        if (menu.children && menu.children.length) {
            const menus = getMenuChildren(menu)
            menus.forEach((item: any) => allMenus.push(item))
        } else {
            allMenus.push(menu)
        }
    })

    return allMenus
}

function getMenuChildren(menu: any) {
    if (menu.children && menu.children.length) {
        return menu.children.reduce((all: any, item: any) => {
            const foundChildren = getMenuChildren(item)
            return all.concat(foundChildren)
        }, [])
    } else {
        return [menu]
    }
}

export { getAllSiderMenu }

/**
 * @description 将菜单转为平级
 * */
function flattenSiderMenu(menuList: any, newList: any) {
    menuList.forEach((menu: any) => {
        let newMenu: any = {}
        for (let i in menu) {
            if (i !== 'children') newMenu[i] = cloneDeep(menu[i])
        }
        newList.push(newMenu)
        menu.children && flattenSiderMenu(menu.children, newList)
    })
    return newList
}

export { flattenSiderMenu }

/**
 * @description 判断列表1中是否包含了列表2中的某一项
 * 因为用户权限 access 为数组，includes 方法无法直接得出结论
 * */
function includeArray(list1: unknown[], list2: unknown[]) {
    let status = false
    list2.forEach((item) => {
        if (list1.includes(item)) status = true
    })
    return status
}

export { includeArray }

/**
 * @description 动态菜单相关
 * */

/**
 * @description 保存动态侧边菜单到本地
 * */
function setNativeMenuSider(data: any) {
    localStorage.setItem(`admin-plus-${Setting.appID}-menu-sider`, JSON.stringify(data))
}

export { setNativeMenuSider }

/**
 * @description 读取本地的动态侧边菜单
 * */
function getNativeMenuSider() {
    return JSON.parse(localStorage.getItem(`admin-plus-${Setting.appID}-menu-sider`) || '[]')
}

export { getNativeMenuSider }

/**
 * @description 保存动态顶栏菜单到本地
 * */
function setNativeMenuHeader(data: any) {
    localStorage.setItem(`admin-plus-${Setting.appID}-menu-header`, JSON.stringify(data))
}

export { setNativeMenuHeader }

/**
 * @description 读取本地的动态顶栏菜单
 * */
function getNativeMenuHeader() {
    return JSON.parse(localStorage.getItem(`admin-plus-${Setting.appID}-menu-header`) || '[]')
}

export { getNativeMenuHeader }
