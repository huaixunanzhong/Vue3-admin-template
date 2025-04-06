import request from '@/plugins/request'

export function AccountLogin(data: Record<string, any>) {
    return request({
        url: 'user/login',
        method: 'post',
        data
    })
}

export function AccountRegister(data: Record<string, any>) {
    return request({
        url: '/api/register',
        method: 'post',
        data
    })
}
