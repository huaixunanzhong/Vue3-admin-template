import { defineStore } from 'pinia'
import util from '@/libs/util'
import { cloneDeep } from 'lodash'
import { useRouter } from 'vue-router'

/** 检查路径是否存在 不存在的话初始化 */
export function pathInit<T = any>({
    dbName = 'database',
    path = '',
    user = true,
    validator = (_val: any) => true,
    defaultValue
}: DB.PathInitParams<T>): string {
    const uuid = util.cookies.get('uuid') || 'ghost-uuid'
    const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
    const value = util.db.get(currentPath).value()

    if (!(value !== undefined && validator(value))) {
        util.db.set(currentPath, defaultValue).write()
    }
    return currentPath
}

const storeSetup = () => {
    const router = useRouter()
    /** 将数据存储到指定位置 路径不存在会自动初始化 效果类似于取值 dbName.path = value */
    const set = <T = unknown>({
        dbName = 'database',
        path = '',
        value,
        user = false
    }: DB.DBSetOptions<T>) => {
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
    }
    /** 获取数据 效果类似于取值 dbName.path || defaultValue */
    const get = <T = unknown>({
        dbName = 'database',
        path = '',
        defaultValue,
        user = false
    }: DB.DBGetOptions<T>) => {
        return new Promise<T>((resolve) => {
            resolve(
                cloneDeep(
                    util.db
                        .get(
                            pathInit<T>({
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
    }
    /** 获取存储数据库对象 */
    const database = ({ user = false } = {}) => {
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
    }
    /** 清空存储数据库对象 */
    const databaseClear = ({ user = false } = {}) => {
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
    }
    /** 获取存储数据库对象 [ 区分页面 ] */
    const databasePage = ({ basis = 'fullPath', user = false } = {}) => {
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
    }
    /** 清空存储数据库对象 [ 区分页面 ] */
    const databasePageClear = ({ basis = 'fullPath', user = false } = {}) => {
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
    }
    /** 快速将页面当前的数据 ( $data ) 持久化 */
    const pageSet = ({ instance, basis = 'fullPath', user = false }: any) => {
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
    }
    /** 快速获取页面快速持久化的数据 */
    const pageGet = ({ instance, basis = 'fullPath', user = false }: any) => {
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
    }
    /** 清空页面快照 */
    const pageClear = ({ basis = 'fullPath', user = false }) => {
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

    return {
        set,
        get,
        database,
        databaseClear,
        databasePage,
        databasePageClear,
        pageSet,
        pageGet,
        pageClear
    }
}

export const useDbStore = defineStore('db', storeSetup)
