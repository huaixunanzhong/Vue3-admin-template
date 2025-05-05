declare namespace Log {
    /** log state  */
    interface LogStateItem {
        message: string
        type: 'info' | 'error'
        time: string
        meta: {
            // 当前用户信息
            user: User.UserInfo | {}
            // 当前用户的 uuid
            uuid: string
            // 当前的 token
            token: string
            // 当前地址
            url: string
            // 用户设置
            [key: string]: any
        }
    }
    /** push 方法参数 */
    interface PushPayload {
        message: string
        type?: 'info' | 'error'
        meta?: Record<any, any>
    }
}
