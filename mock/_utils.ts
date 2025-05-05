import Mock from 'mockjs'
import XEUtils from 'xe-utils'
import { MockTokenItem, MockUserItem } from './data/type'

/** 获取 50-300ms 的随机延时  */
export const getDelayTime = () => {
    return XEUtils.random(50, 300)
}

export const matchUserData = (data: MockUserItem[], token: MockTokenItem) => {
    switch (token) {
        case 'A68NUPaXVBJYRStwvd9frcUn8rlf30h6':
            return data.find((item) => item.info.access.includes('Super Admin'))
        case 'A68NUPaXVBJYRStwvd9frcUn8rlf30h7':
            return data.find((item) => item.info.access.includes('User'))
        default:
            return {}
    }
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
