import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, cloneDeep } from 'lodash'
import Setting from '@/setting'
import menuSider from '@/menu/sider'
import { useDbStore, useUserStore } from '@/store'
import { getAllSiderMenu, includeArray } from '@/libs/system'
import { type RouteLocationNormalizedGeneric, useRouter } from 'vue-router'

// 判定是否需要缓存
const isKeepAlive = (data: any) => get(data, 'meta.cache', false)

const storeSetup = () => {
    const dbStore = useDbStore()
    const userStore = useUserStore()
    const router = useRouter()

    // 可以在多页 tab 模式下显示的页面
    const pool = ref<Page.Pool[]>([])
    // 当前显示的多页面列表
    const opened = ref<Page.Opened[]>(Setting.page.opened)
    // 当前页面
    const current = ref('')
    // 需要缓存的页面 name
    const keepAlive = ref([])

    /** 从持久化数据载入分页列表 */
    const openedLoad = ({ loadOpenedTabs = true }) => {
        return new Promise<null>(async (resolve) => {
            // store 赋值
            let value = await dbStore.get<typeof Setting.page.opened>({
                dbName: 'sys',
                path: 'page.opened',
                defaultValue: Setting.page.opened,
                user: true
            })
            if (!loadOpenedTabs) value = []
            // 在处理函数中进行数据优化 过滤掉现在已经失效的页签或者已经改变了信息的页签
            // 以 fullPath 字段为准
            // 如果页面过多的话可能需要优化算法
            // valid 有效列表 1, 1, 0, 1 => 有效, 有效, 失效, 有效
            const valid: (0 | 1)[] = []
            // 处理数据
            opened.value = value
                .map((opened: Page.Opened) => {
                    // 忽略首页
                    if (opened.fullPath === '/index') {
                        valid.push(1)
                        return opened
                    }
                    // 尝试在所有的支持多标签页的页面里找到 name 匹配的页面
                    const find = pool.value.find((item: any) => item.name === opened.name)
                    // 如果 value 项有 keepMeta 字段，则保留 meta
                    if (opened.keepMeta) {
                        find!.meta = Object.assign({}, opened.meta)
                    }
                    // 记录有效或无效信息
                    valid.push(find ? 1 : 0)
                    // 返回合并后的数据 新的覆盖旧的
                    // 新的数据中一般不会携带 params 和 query, 所以旧的参数会留存
                    return Object.assign({}, opened, find)
                })
                .filter((_: any, index: number) => valid[index] === 1)
                // 对 menu 鉴权过滤
                .filter((opened: any) => {
                    const allSiderMenu = getAllSiderMenu(menuSider)
                    const find = allSiderMenu.find((item) => item['path'] === opened.fullPath)

                    let state = true
                    if (find && find['auth']) {
                        const userInfo = userStore.userInfo
                        // @权限
                        const access = cloneDeep(userInfo.access)
                        // 给 access 强制加一个 hidden 的权限，否则菜单隐藏后，Tabs 页签会不显示该页签
                        // @ts-ignore
                        access.push('hidden')
                        // 如果用户当前的权限，不是该 menu 对应的 权限，则过滤这个 Tab
                        if (access && !includeArray(find['auth'], access)) state = false
                    }
                    return state
                })
            // 根据 opened 数据生成缓存设置
            keepAliveRefresh()
            // end
            resolve(null)
        })
    }
    /** 将 opened 属性赋值并持久化 在这之前请先确保已经更新了 state.opened */
    const opened2db = () => {
        return new Promise<null>(async (resolve) => {
            // 设置数据
            dbStore.set<typeof opened.value>({
                dbName: 'sys',
                path: 'page.opened',
                value: opened.value,
                user: true
            })
            // end
            resolve(null)
        })
    }
    /** 更新页面列表上的某一项 */
    const openedUpdate = ({
        index,
        params,
        query,
        fullPath,
        meta,
        keepMeta = false
    }: Omit<Page.Opened, 'name' | 'path'>) => {
        return new Promise<null>(async (resolve) => {
            // 更新页面列表某一项
            let page = opened.value[index]
            page.params = params || page.params
            page.query = query || page.query
            page.fullPath = fullPath || page.fullPath
            page.meta = meta || page.meta
            page.keepMeta = keepMeta
            opened.value.splice(index, 1, page)
            // 持久化
            await opened2db()
            // end
            resolve(null)
        })
    }
    /** 更新页面当前项 */
    const currentUpdate = ({
        params,
        query,
        fullPath,
        meta,
        keepMeta = false
    }: Omit<Page.Opened, 'name' | 'path'>) => {
        return new Promise<null>(async (resolve) => {
            setTimeout(async () => {
                // 更新当前项
                const index = opened.value.findIndex((item: any) => item.fullPath === current.value)
                let page = opened.value[index]
                page.params = params || page.params
                page.query = query || page.query
                page.fullPath = fullPath || page.fullPath
                page.meta = meta || page.meta
                page.keepMeta = keepMeta
                opened.value.splice(index, 1, page)
                // 持久化
                await opened2db()
                // end
                resolve(null)
            }, 0)
        })
    }
    /** 新增一个 tag (打开一个页面) */
    const add = ({ tag, params, query, fullPath }: any) => {
        return new Promise<null>(async (resolve) => {
            // 设置新的 tag 在新打开一个以前没打开过的页面时使用
            let newTag = tag
            newTag.params = params || newTag.params
            newTag.query = query || newTag.query
            newTag.fullPath = fullPath || newTag.fullPath
            // 添加进当前显示的页面数组
            opened.value.push(newTag)
            // 如果这个页面需要缓存 将其添加到缓存设置
            if (isKeepAlive(newTag)) {
                keepAlivePush(tag.name)
            }
            // 持久化
            await opened2db()
            // end
            resolve(null)
        })
    }
    /** 打开一个新的页面 */
    const open = ({ name, params, query, fullPath }: RouteLocationNormalizedGeneric) => {
        return new Promise<void>(async (resolve) => {
            // 已经打开的页面
            let _opened = opened.value
            // 判断此页面是否已经打开 并且记录位置
            let pageOpenedIndex = 0
            const pageOpened = _opened.find((page: any, index: any) => {
                const same = page.fullPath === fullPath
                pageOpenedIndex = same ? index : pageOpenedIndex
                return same
            })
            if (pageOpened) {
                // 页面以前打开过
                // @ts-ignore
                await openedUpdate({
                    index: pageOpenedIndex,
                    params,
                    query,
                    fullPath
                })
            } else {
                // 页面以前没有打开过
                let page = pool.value.find((t: any) => t.name === name)
                // 如果这里没有找到 page 代表这个路由虽然在框架内 但是不参与标签页显示
                if (page) {
                    await add({
                        tag: Object.assign({}, page),
                        params,
                        query,
                        fullPath
                    })
                }
            }
            currentSet(fullPath)
            // end
            resolve()
        })
    }
    /** 关闭一个 tag (关闭一个页面) */
    const close = ({ tagName }: { tagName: string }) => {
        return new Promise(async (resolve) => {
            // 下个新的页面
            let newPage: Page.Opened | Record<string, any> = opened.value[0]
            const isCurrent = current.value === tagName
            // 如果关闭的页面就是当前显示的页面
            if (isCurrent) {
                // 去找一个新的页面
                let len = opened.value.length
                for (let i = 0; i < len; i++) {
                    if (opened.value[i].fullPath === tagName) {
                        // 是否只剩最后一个，是则跳首页
                        if (len > 1) {
                            // 如果是最后一个，则向前一个跳，否则向下一个跳
                            if (i === len - 1) {
                                newPage = opened.value[i - 1]
                            } else {
                                newPage = opened.value[i + 1]
                            }
                        } else {
                            newPage = {}
                        }
                        break
                    }
                }
            }
            // 找到这个页面在已经打开的数据里是第几个
            const index = opened.value.findIndex((page: any) => page.fullPath === tagName)
            if (index >= 0) {
                // 如果这个页面是缓存的页面 将其在缓存设置中删除
                keepAliveRemove(opened.value[index].name)
                // 更新数据 删除关闭的页面
                opened.value.splice(index, 1)
            }
            // 持久化
            await opened2db()
            // 最后需要判断是否需要跳到首页
            if (isCurrent) {
                const { name = 'index', params = {}, query = {} } = newPage
                let routerObj = {
                    name,
                    params,
                    query
                }
                await router.push(routerObj)
            }
            // end
            resolve(null)
        })
    }

    /** 关闭当前标签左边的标签 */
    const closeLeft = ({ pageSelect }: Partial<{ pageSelect: string }> = {}) => {
        return new Promise<null>(async (resolve) => {
            const pageAim = pageSelect || current.value
            let currentIndex = 0
            opened.value.forEach((page: any, index: any) => {
                if (page.fullPath === pageAim) {
                    currentIndex = index
                }
            })
            if (currentIndex > 0) {
                // 删除打开的页面 并在缓存设置中删除
                opened.value
                    .splice(1, currentIndex - 1)
                    .forEach(({ name }: any) => keepAliveRemove(name))
            }
            current.value = pageAim
            if (router.currentRoute.value.fullPath !== pageAim) {
                await router.push(pageAim)
            }
            // 持久化
            await opened2db()
            // end
            resolve(null)
        })
    }
    /** 关闭当前标签右边的标签 */
    const closeRight = ({ pageSelect }: Partial<{ pageSelect: string }> = {}) => {
        return new Promise<null>(async (resolve) => {
            const pageAim = pageSelect || current.value
            let currentIndex = 0
            opened.value.forEach((page: any, index: any) => {
                if (page.fullPath === pageAim) {
                    currentIndex = index
                }
            })
            // 删除打开的页面 并在缓存设置中删除
            opened.value.splice(currentIndex + 1).forEach(({ name }: any) => keepAliveRemove(name))
            // 设置当前的页面
            current.value = pageAim
            if (router.currentRoute.value.fullPath !== pageAim) {
                await router.push(pageAim)
            }
            // 持久化
            await opened2db()
            // end
            resolve(null)
        })
    }
    /** 关闭当前激活之外的 tag */
    const closeOther = ({ pageSelect }: Partial<{ pageSelect: string }> = {}) => {
        return new Promise<null>(async (resolve) => {
            const pageAim = pageSelect || current.value
            let currentIndex = 0
            opened.value.forEach((page: any, index: any) => {
                if (page.fullPath === pageAim) {
                    currentIndex = index
                }
            })
            // 删除打开的页面数据 并更新缓存设置
            if (currentIndex === 0) {
                opened.value.splice(1).forEach(({ name }: any) => keepAliveRemove(name))
            } else {
                opened.value
                    .splice(currentIndex + 1)
                    .forEach(({ name }: any) => keepAliveRemove(name))
                opened.value
                    .splice(1, currentIndex - 1)
                    .forEach(({ name }: any) => keepAliveRemove(name))
            }
            // 设置新的页面
            current.value = pageAim
            if (router.currentRoute.value.fullPath !== pageAim) {
                await router.push(pageAim)
            }
            // 持久化
            await opened2db()
            // end
            resolve(null)
        })
    }
    /** 关闭所有 tag */
    const closeAll = () => {
        return new Promise<null>(async (resolve) => {
            // 删除打开的页面 并在缓存设置中删除
            opened.value.splice(1).forEach(({ name }: any) => keepAliveRemove(name))
            // 持久化
            await opened2db()
            // 关闭所有的标签页后需要判断一次现在是不是在首页
            if (router.currentRoute.value.name !== 'index') {
                await router.push({
                    name: 'index'
                })
            }
            // end
            resolve(null)
        })
    }
    /** 直接更新 opened，用于拖拽调整页签顺序 */
    const updateOpened = ({ opened }: any) => {
        return new Promise<null>(async (resolve) => {
            opened.value = opened
            // 持久化
            await opened2db()
            // end
            resolve(null)
        })
    }

    // keepAlive
    /** 从已经打开的页面记录中更新需要缓存的页面记录 */
    const keepAliveRefresh = () => {
        // @ts-ignore
        keepAlive.value = opened.value
            .filter((item: any) => isKeepAlive(item))
            .map((e: any) => e.name)
    }
    /** 删除一个页面的缓存设置 */
    const keepAliveRemove = (name: any) => {
        const list = [...keepAlive.value]
        const index = list.findIndex((item) => item === name)

        if (index !== -1) {
            list.splice(index, 1)
            keepAlive.value = list
        }
    }
    /** 增加一个页面的缓存设置 */
    const keepAlivePush = (name: any) => {
        const keep = [...keepAlive.value]
        // @ts-ignore
        keep.push(name)
        keepAlive.value = keep
    }
    /** 清空页面缓存设置 */
    const keepAliveClean = () => {
        keepAlive.value = []
    }
    // current
    /** 设置当前激活的页面 fullPath  新的fullPath*/
    const currentSet = (fullPath: any) => {
        current.value = fullPath
    }
    // pool
    /** 保存 pool (候选池) */
    const init = (routes: any) => {
        const _pool: any[] = []
        const push = function (routes: any) {
            routes.forEach((route: any) => {
                if (route.children) {
                    push(route.children)
                } else {
                    if (!route.hidden) {
                        const { meta, name, path } = route
                        _pool.push({ meta, name, path })
                    }
                }
            })
        }
        push(routes)
        pool.value = _pool
    }

    return {
        pool,
        opened,
        current,
        keepAlive,
        openedLoad,
        opened2db,
        openedUpdate,
        currentUpdate,
        add,
        open,
        close,
        closeAll,
        closeLeft,
        closeRight,
        closeOther,
        updateOpened,
        keepAliveRefresh,
        keepAliveRemove,
        keepAlivePush,
        keepAliveClean,
        currentSet,
        init
    }
}

export const usePageStore = defineStore('Page', storeSetup)
