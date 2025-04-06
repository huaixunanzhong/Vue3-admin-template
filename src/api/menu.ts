import request from '@/plugins/request';

export function MenuList (data?: Record<string, any>) {
    return request({
        url: '/api/system/menu/list',
        method: 'post',
        data
    });
}
