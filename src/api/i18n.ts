import request from '@/plugins/request';

export function I18nList (data?: Record<string, any>) {
    return request({
        url: '/api/system/i18n/list',
        method: 'post',
        data
    });
}
