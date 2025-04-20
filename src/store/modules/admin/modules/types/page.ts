import type { RouteParams, LocationQuery } from 'vue-router'

export interface PageState {
    // 可以在多页 tab 模式下显示的页面
    pool: any[]
    // 当前显示的多页面列表
    opened: (OpenedUpdatePayload & { name: string })[]
    // 当前页面
    current: string
    // 需要缓存的页面 name
    keepAlive: any[]
}
/** OpenedUpdate的Payload */
export interface OpenedUpdatePayload {
    index: any
    params: RouteParams
    query: LocationQuery
    fullPath: string
    meta: Record<string, any>
    keepMeta?: boolean
}
/** add的payload类型 新Tag信息 */
export interface AddPayload {
    tag: any
    params: RouteParams
    query: LocationQuery
    fullPath: string
}
/** open的payload类型 从路由钩子的 to 对象上获取 { name, params, query, fullPath } 路由信息 */
export interface OpenPayload {
    name: any
    params: RouteParams
    query: LocationQuery
    fullPath: string
}

/** close的payload类型 */
export interface ClosePayload {
    // 要关闭的标签名字
    tagName: string
}
/**  */
export interface CloseLeftPayload {
    // 当前选中的tagName
    pageSelect: string
}
