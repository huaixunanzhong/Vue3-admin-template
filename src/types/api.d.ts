declare namespace Api {
    // 接口返回的错误信息
    interface ErrorInfo {
        [key: string]: string[]
    }

    // 基础接口返回的数据结构
    interface BaseResult<T = unknown> {
        code: number // 状态码
        msg: string // 消息
        errors?: ErrorInfo // 错误
        request_id?: string | null // 请求ID
        data: T // 数据
    }
}
