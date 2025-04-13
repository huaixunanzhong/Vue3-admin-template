export interface LogItem {
    // 日志信息
    message: string
    // 类型 默认 info 其中 error 会以具体数目强调显示，其它以点轻量显示
    type: 'info' | 'success' | 'warning' | 'error'
    // 日志记录时间
    time: number
    // 其它携带信息
    meta: any
}
export interface LogState {
    // 错误日志，单条属性
    log: LogItem[]
}

export interface PushPayload {
    // 信息
    message: string
    // 类型
    type: string
    // 附带的信息
    meta: Record<string, any>
}
