import type { ComponentPublicInstance } from 'vue'

export interface DBState {}

/** 设置数据函数的参数 */
export interface SetParams {
    // 数据库名称
    dbName?: string
    // 存储路径
    path?: string
    // 需要存储的值
    value?: string
    // 是否区分用户
    user?: boolean
}
/** 获取数据函数的参数 */
export interface GetParams {
    // 数据库名称
    dbName?: string
    // 存储路径
    path?: string
    // 取值失败的默认值
    defaultValue?: string
    // 是否区分用户
    user?: boolean
}
/** 获取或者清空存储数据库对象函数的参数 */
export interface DatabaseParams {
    // 是否区分用户
    user?: boolean
}

export interface DatabasePageParams {
    // 页面区分依据
    basis?: 'name' | 'path' | 'fullPath'
    // 是否区分用户
    user?: boolean
}

export interface PageSetParams {
    //  vue 实例
    instance: ComponentPublicInstance
    // 页面区分依据
    basis: 'name' | 'path' | 'fullPath'
    // 是否区分用户
    user: boolean
}

export interface PathInitParams {
    // 数据库名称
    dbName?: string
    // 路径
    path?: string
    // 区分用户
    user?: boolean
    // 数据校验钩子 返回 true 表示验证通过
    validator?: (val: any) => boolean
    // 初始化默认值
    defaultValue?: any
}
