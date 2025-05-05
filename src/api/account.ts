import request from '@/plugins/request'

export const Login = (data: Account.LoginParams) => {
    return request.post<{ token: string }>({
        url: '/user/login',
        data
    })
}

export const GetUserInfo = () => {
    return request.get<Account.UserInfoResult>({
        url: '/user/info'
    })
}

export const Register = (data: Record<string, any>) => {
    return request.post<User.UserInfoWidthToken>({
        url: '/api/register',
        data
    })
}
