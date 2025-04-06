import { defineMock } from '../_base'
import { type MockTokenItem, getDelayTime, resultError, resultSuccess } from '../_utils'

export default defineMock([
    {
        url: '/user/login',
        method: 'post',
        timeout: getDelayTime(),
        response: ({ body }) => {
            console.log(JSON.stringify(body))
            const { username, password } = body
            if (!username) return resultError(null, '用户名不能为空', 50000)
            if (!password) return resultError(null, '密码不能为空', 50000)
            if (username === 'admin' && password === 'admin') {
                const token: MockTokenItem = 'token_admin'
                return resultSuccess({ token })
            }
            if (username === 'user' && password === 'admin') {
                const token: MockTokenItem = 'token_user'
                return resultSuccess({ token })
            }
            return resultError(null, '账号或者密码错误', 50000)
        }
    }
])
