/**
 * 持久化存储
 * 一般情况下，您无需修改此文件
 * */
import util from '@/libs/util'
import router from '@/router'
import { cloneDeep } from 'lodash'
import { ActionTree } from 'vuex'
import { RootState } from '@/store/type.ts'
import type {
    DBState,
    SetParams,
    GetParams,
    DatabaseParams,
    DatabasePageParams,
    PageSetParams,
    PathInitParams
} from '../modules/types/db.ts'

/**
 * @description 检查路径是否存在 不存在的话初始化
 * @returns {String} 可以直接使用的路径
 */
function pathInit({
    dbName = 'database',
    path = '',
    user = true,
    validator = (_val: any) => true,
    defaultValue = ''
}: PathInitParams): string {
    const uuid = util.cookies.get('uuid') || 'ghost-uuid'
    const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
    const value = util.db.get(currentPath).value()

    if (!(value !== undefined && validator(value))) {
        util.db.set(currentPath, defaultValue).write()
    }
    return currentPath
}

const actions: ActionTree<DBState, RootState> = {
    /** 将数据存储到指定位置 路径不存在会自动初始化 效果类似于取值 dbName.path = value */
    set(
        _: Record<string, any>,
        { dbName = 'database', path = '', value = '', user = false }: SetParams
    ) {
        util.db
            .set(
                pathInit({
                    dbName,
                    path,
                    user
                }),
                value
            )
            .write()
    },
    /** 获取数据 效果类似于取值 dbName.path || defaultValue */
    get(
        _context: Record<string, any>,
        { dbName = 'database', path = '', defaultValue = '', user = false }: GetParams
    ) {
        return new Promise((resolve) => {
            resolve(
                cloneDeep(
                    util.db
                        .get(
                            pathInit({
                                dbName,
                                path,
                                user,
                                defaultValue
                            })
                        )
                        .value()
                )
            )
        })
    },
    /** 获取存储数据库对象 */
    database(_context: Record<string, any>, { user = false }: DatabaseParams = {}) {
        return new Promise((resolve) => {
            resolve(
                util.db.get(
                    pathInit({
                        dbName: 'database',
                        path: '',
                        user,
                        defaultValue: {}
                    })
                )
            )
        })
    },
    /** 清空存储数据库对象 */
    databaseClear(_context: Record<string, any>, { user = false }: DatabaseParams = {}) {
        return new Promise((resolve) => {
            resolve(
                util.db.get(
                    pathInit({
                        dbName: 'database',
                        path: '',
                        user,
                        validator: () => false,
                        defaultValue: {}
                    })
                )
            )
        })
    },
    /** 获取存储数据库对象 [ 区分页面 ] */
    databasePage(
        _context: Record<string, any>,
        { basis = 'fullPath', user = false }: DatabasePageParams = {}
    ) {
        return new Promise((resolve) => {
            resolve(
                util.db.get(
                    pathInit({
                        dbName: 'database',
                        path: `$page.${router['app'].$route[basis]}`,
                        user,
                        defaultValue: {}
                    })
                )
            )
        })
    },
    /** 清空存储数据库对象 [ 区分页面 ] */
    databasePageClear(
        _context: Record<string, any>,
        { basis = 'fullPath', user = false }: DatabasePageParams = {}
    ) {
        return new Promise((resolve) => {
            resolve(
                util.db.get(
                    pathInit({
                        dbName: 'database',
                        path: `$page.${router['app'].$route[basis]}`,
                        user,
                        validator: () => false,
                        defaultValue: {}
                    })
                )
            )
        })
    },
    /** 快速将页面当前的数据 ( $data ) 持久化 */
    pageSet(
        _context: Record<string, any>,
        { instance, basis = 'fullPath', user = false }: PageSetParams
    ) {
        return new Promise((resolve) => {
            resolve(
                util.db.get(
                    pathInit({
                        dbName: 'database',
                        path: `$page.${router['app'].$route[basis]}.$data`,
                        user,
                        validator: () => false,
                        defaultValue: cloneDeep(instance.$data)
                    })
                )
            )
        })
    },
    /** 快速获取页面快速持久化的数据 */
    pageGet(
        _context: Record<string, any>,
        { instance, basis = 'fullPath', user = false }: PageSetParams
    ) {
        return new Promise((resolve) => {
            resolve(
                cloneDeep(
                    util.db
                        .get(
                            pathInit({
                                dbName: 'database',
                                path: `$page.${router['app'].$route[basis]}.$data`,
                                user,
                                defaultValue: cloneDeep(instance.$data)
                            })
                        )
                        .value()
                )
            )
        })
    },
    /** 清空页面快照 */
    pageClear(
        _context: Record<string, any>,
        { basis = 'fullPath', user = false }: Omit<PageSetParams, 'instance'>
    ) {
        return new Promise((resolve) => {
            resolve(
                util.db.get(
                    pathInit({
                        dbName: 'database',
                        path: `$page.${router['app'].$route[basis]}.$data`,
                        user,
                        validator: () => false,
                        defaultValue: {}
                    })
                )
            )
        })
    }
}
export { pathInit }

export default {
    namespaced: true,
    actions
}
