import { defineMock } from '../_base'
import { getDelayTime, matchUserData, resultError, resultSuccess } from '../_utils'
import { data, USER_TOKENS } from '../data/user'
import type { MockTokenItem } from '../data/type'

export default defineMock([
    {
        url: '/user/login',
        method: 'post',
        timeout: getDelayTime(),
        response: ({ body }) => {
            const { username, password } = body
            if (!username) return resultError(null, '用户名不能为空', 50000)
            if (!password) return resultError(null, '密码不能为空', 50000)
            if (username === 'admin' && password === 'admin') {
                const token: MockTokenItem = 'A68NUPaXVBJYRStwvd9frcUn8rlf30h6'
                return resultSuccess({ token })
            }
            if (username === 'user' && password === 'user') {
                const token: MockTokenItem = 'A68NUPaXVBJYRStwvd9frcUn8rlf30h7'
                return resultSuccess({ token })
            }
            return resultError(null, '账号或者密码错误', 50000)
        }
    },
    {
        url: '/user/info',
        method: 'get',
        timeout: getDelayTime(),
        response: ({ headers }) => {
            const token = headers.token
            console.log(token)
            if (token && USER_TOKENS.includes(token)) {
                return resultSuccess(matchUserData(data, token))
            } else {
                return resultError(null, 'token失效', 401)
            }
        }
    }
])
