import Mock from 'mockjs'
import XEUtils from 'xe-utils'

export type MockTokenItem = 'token_admin' | 'token_user'

/** 获取 50-300ms 的随机延时  */
export const getDelayTime = () => {
    return XEUtils.random(50, 300)
}

/** 返回成功数据 */
export const resultSuccess = (data: unknown) => {
    return Mock.mock({
        code: 0,
        data,
        message: '请求成功',
        success: true
    })
}

/** 返回失败数据 */
export const resultError = (data: unknown, message: string, code = 500) => {
    return Mock.mock({
        code,
        data,
        message,
        success: false
    })
}
