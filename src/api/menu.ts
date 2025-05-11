import request from '@/plugins/request'

export function MenuList(data?: Record<string, any>) {
    return request.post({
        url: '/api/system/menu/list',
        data
    })
}
